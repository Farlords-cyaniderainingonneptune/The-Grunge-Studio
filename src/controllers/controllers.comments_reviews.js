import * as Helpers from '../utils/utils.helpers.js'
import * as reviewCommentModel from '../models/models.comments_reviews.js';
import * as songModel from '../models/models.songs.js'
import * as authModel from '../models/models.auth.js';

export const reviewSong = async (req, res) => {
    const userId = req.user.user_id;
    const {songId} = req.params.song_id
    try{
        const {review, ratings} = req.body;
        if (!review || !ratings){
            return res.status(422).json({
                status:'error',
                code:422,
                message:'Please enter review and ratings'
            });
        }
        const songExists = await songModel.songExistsById(songId);
        if(!songExists){
            return res.status(404).json({
                status:'error',
                code:404,
                message:'Song not found'
            });
        };
        const reviewSong = await reviewCommentModel.reviewSong(songId, userId, review, ratings);
        if (!reviewSong){
            return res.status(409).json({
                status:'error',
                code:409,
                message:'unable to complete action'
            }); 
        };
        return res.status(200).json({
            status:'success',
            code:200,
            message:'Review successfully posted',
            data: reviewSong
        }); 


    }catch(error){
       return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        }); 
    }
}

export const commentSong = async(req, res) => {
    const userId = req.user.user_id;
    const {reviewId} = req.params.review_id;
    try{
        const {comment} = req.body
        if(!comment){
            return res.status(422)({
                status:'error',
                code:422,
                message:'Please enter comment'
            });
        };
        const reviewExists = await reviewCommentModel.reviewById(review_id)
        if(!reviewExists){
            return res.status(404).json({
                status:'error',
                code:404,
                message:`Review not found`
        });
        };
        const postComment = await likesRateModel.postComment(review_id, user_id, comment);
        if(!postComment){
           return res.status(403).json({
                status:'error',
                code:403,
                message:`unable to post comment`
        }); 
        };
        return res.status(200).json({
            status:'error',
            code:200,
            message:`Comment posted successfully`,
            data: postComment
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        })
    }
}