import * as Helpers from '../utils/utils.helpers.js'
import * as reviewCommentModel from '../models/models.comments_reviews.js';
import * as songModel from '../models/models.songs.js'
import * as authModel from '../models/models.auth.js';

// create a review for a song
export const review = async (req, res) => {
    try{
        const userId = req.user.user_id;
        const song_id = req.params.song_id;
        const { review: review_content, ratings } = req.body;
        if (!review_content || !ratings){
            return res.status(422).json({
                status:'error',
                code:422,
                message:'Please enter review and ratings'
            });
        };
        const rating = Number(ratings);
        if (!Number.isInteger(rating) || rating < 1 || rating > 5){
            return res.status(422).json({
                status:'error',
                code:422,
                message:'ratings must be an integer between 1 and 5'
            });
        };
        const userExists = await authModel.checkIfUserActivelyExistsByUserId(userId);
        if(!userExists){
            return res.status(401).json({
                status:'error',
                code:401,
                message:'user does not exist'
            });
        };
        const songExists = await songModel.songExistsById(song_id);
        if(!songExists){
            return res.status(404).json({
                status:'error',
                code:404,
                message:'Song not found'
            });
        };
        const newReview = await reviewCommentModel.reviewSong(song_id, userId, review_content, rating);
        if (!newReview){
            return res.status(409).json({
                status:'error',
                code:409,
                message:'unable to complete action'
            });
        };
        return res.status(201).json({
            status:'success',
            code:201,
            message:'Review successfully posted',
            data: newReview
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        });
    }
}

// comment on a review
export const commentReview = async (req, res) => {
    try{
        const userId = req.user.user_id;
        const review_id = req.params.review_id;
        const { comment } = req.body;
        if(!comment){
            return res.status(422).json({
                status:'error',
                code:422,
                message:'Please enter comment'
            });
        };
        const userExists = await authModel.checkIfUserActivelyExistsByUserId(userId);
        if(!userExists){
            return res.status(401).json({
                status:'error',
                code:401,
                message:'user does not exist'
            });
        };
        const reviewExists = await reviewCommentModel.reviewById(review_id);
        if(!reviewExists){
            return res.status(404).json({
                status:'error',
                code:404,
                message:'Review not found'
            });
        };
        const newComment = await reviewCommentModel.postComment(review_id, userId, comment);
        if(!newComment){
            return res.status(409).json({
                status:'error',
                code:409,
                message:'unable to post comment'
            });
        };
        return res.status(201).json({
            status:'success',
            code:201,
            message:'Comment posted successfully',
            data: newComment
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        })
    }
}

// comment on a comment (reply to a comment)
// NOTE: the review_comments table has no parent_comment_id column, so replies
// are stored against the review that the parent comment belongs to.
export const commentComment = async (req, res) => {
    try{
        const userId = req.user.user_id;
        const comment_id = req.params.comment_id;
        const { comment } = req.body;
        if(!comment){
            return res.status(422).json({
                status:'error',
                code:422,
                message:'Please enter comment'
            });
        };
        const userExists = await authModel.checkIfUserActivelyExistsByUserId(userId);
        if(!userExists){
            return res.status(401).json({
                status:'error',
                code:401,
                message:'user does not exist'
            });
        };
        const parentComment = await reviewCommentModel.commentExistsById(comment_id);
        if(!parentComment || parentComment.is_deleted){
            return res.status(404).json({
                status:'error',
                code:404,
                message:'Comment not found'
            });
        };
        const newComment = await reviewCommentModel.postComment(parentComment.review_id, userId, comment);
        if(!newComment){
            return res.status(409).json({
                status:'error',
                code:409,
                message:'unable to post comment'
            });
        };
        return res.status(201).json({
            status:'success',
            code:201,
            message:'Reply posted successfully',
            data: newComment
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        })
    }
}

// edit a review (only the owner of the review can edit it)
export const editReview = async (req, res) => {
    try{
        const userId = req.user.user_id;
        const review_id = req.params.review_id;
        const { review: review_content, ratings } = req.body;
        if (!review_content || !ratings){
            return res.status(422).json({
                status:'error',
                code:422,
                message:'Please enter review and ratings'
            });
        };
        const rating = Number(ratings);
        if (!Number.isInteger(rating) || rating < 1 || rating > 5){
            return res.status(422).json({
                status:'error',
                code:422,
                message:'ratings must be an integer between 1 and 5'
            });
        };
        const userExists = await authModel.checkIfUserActivelyExistsByUserId(userId);
        if(!userExists){
            return res.status(401).json({
                status:'error',
                code:401,
                message:'user does not exist'
            });
        };
        const reviewExists = await reviewCommentModel.reviewById(review_id);
        if(!reviewExists){
            return res.status(404).json({
                status:'error',
                code:404,
                message:'Review not found'
            });
        };
        // ownership check: users can only edit their own reviews
        if (reviewExists.user_id !== userId){
            return res.status(403).json({
                status:'error',
                code:403,
                message:'You are not authorized to edit this review'
            });
        };
        const updatedReview = await reviewCommentModel.editReview(review_id, userId, review_content, rating);
        if (!updatedReview){
            return res.status(409).json({
                status:'error',
                code:409,
                message:'unable to complete action'
            });
        };
        return res.status(200).json({
            status:'success',
            code:200,
            message:'Review updated successfully',
            data: updatedReview
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        });
    }
}

// view all comments (paginated)
export const getComments = async (req, res) => {
    try{
        const { query } = req;
        if(parseInt(query.per_page) > 100){
            return res.status(422).json({
                status:'error',
                code:422,
                message:'Unprocessable entity, kindly check your per_page'
            });
        };
        const { offset, limit } = Helpers.paginationOffsetLimit(query);
        const comments = await reviewCommentModel.getComments(offset, limit);
        const totalComments = await reviewCommentModel.commentCount();
        const totalCommentsCount = parseInt(totalComments.count);
        const totalPages = Helpers.paginationTotalPages(totalCommentsCount, limit);
        return res.status(200).json({
            status:'success',
            code:200,
            message:'Comments retrieved successfully',
            data: {
                page: parseInt(query.page) || 1,
                total_count: totalCommentsCount,
                total_pages: parseInt(totalPages),
                comments
            }
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        })
    }
}

// edit a comment (only the owner of the comment can edit it)
export const editComment = async (req, res) => {
    try{
        const userId = req.user.user_id;
        const comment_id = req.params.comment_id;
        const { comment } = req.body;
        if(!comment){
            return res.status(422).json({
                status:'error',
                code:422,
                message:'Please enter comment'
            });
        };
        const userExists = await authModel.checkIfUserActivelyExistsByUserId(userId);
        if(!userExists){
            return res.status(401).json({
                status:'error',
                code:401,
                message:'user does not exist'
            });
        };
        const commentExists = await reviewCommentModel.commentExistsById(comment_id);
        if(!commentExists || commentExists.is_deleted){
            return res.status(404).json({
                status:'error',
                code:404,
                message:'Comment not found'
            });
        };
        // ownership check: users can only edit their own comments
        if (commentExists.user_id !== userId){
            return res.status(403).json({
                status:'error',
                code:403,
                message:'You are not authorized to edit this comment'
            });
        };
        const updatedComment = await reviewCommentModel.editComment(comment_id, userId, comment);
        if(!updatedComment){
            return res.status(409).json({
                status:'error',
                code:409,
                message:'unable to complete action'
            });
        };
        return res.status(200).json({
            status:'success',
            code:200,
            message:'Comment updated successfully',
            data: updatedComment
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        })
    }
}

// delete a comment (only the owner of the comment can delete it)
export const deleteComment = async (req, res) => {
    try{
        const userId = req.user.user_id;
        const comment_id = req.params.comment_id;
        const userExists = await authModel.checkIfUserActivelyExistsByUserId(userId);
        if(!userExists){
            return res.status(401).json({
                status:'error',
                code:401,
                message:'user does not exist'
            });
        };
        const commentExists = await reviewCommentModel.commentExistsById(comment_id);
        if(!commentExists || commentExists.is_deleted){
            return res.status(404).json({
                status:'error',
                code:404,
                message:'Comment not found'
            });
        };
        // ownership check: users can only delete their own comments
        if (commentExists.user_id !== userId){
            return res.status(403).json({
                status:'error',
                code:403,
                message:'You are not authorized to delete this comment'
            });
        };
        const deletedComment = await reviewCommentModel.deleteComment(comment_id, userId);
        if(!deletedComment){
            return res.status(409).json({
                status:'error',
                code:409,
                message:'unable to complete action'
            });
        };
        return res.status(200).json({
            status:'success',
            code:200,
            message:'Comment deleted successfully',
            data: deletedComment
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        })
    }
}