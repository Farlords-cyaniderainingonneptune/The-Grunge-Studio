import db from "../config/db/index.js";
import queries from "../queries/queries.comments_reviews.js";

export const postComment = async(review_id, user_id, comment)=>{
    const postComment = await db.oneOrNone(queries.postComment,[review_id, user_id, comment]);
    return postComment;
}
export const commenter = async(comment_id)=>{
    const commenter = await db.oneOrNone(queries.commenter,[comment_id]);
    return commenter;
}
export const commentExistsById = async(comment_id)=>{
    const commentExists = await db.oneOrNone(queries.commentExistsById,[comment_id]);
    return commentExists;
}
export const commentExistsByUserId = async(user_id)=>{
    const commentExists = await db.oneOrNone(queries.commentExistsByUserId,[user_id]);
    return commentExists;
};
export const commentExistsByReview = async(review_id)=>{
    const commentExists = await db.oneOrNone(queries.commentExistsByReview,[review_id]);
    return commentExists;
};
export const editComment = async(comment_id, user_id, comment)=>{
    const comment = await db.oneOrNone(queries.editComment,[comment_id, user_id, comment]);
    return comment;
};
export const deleteComment = async(comment_id, user_id)=>{
    const comment = await db.oneOrNone(queries.deleteComment,[comment_id, user_id]);
    return comment;
};

export const reviewSong = async(review_content, ratings)=>{
    const review = await db.oneOrNone(queries.reviewSong,[review_content, ratings]);
    return review;
};
export const editReview = async(review_id, user_id, review_content, ratings )=>{
    const review = await db.oneOrNone(queries.editReview,[review_id, user_id, review_content, ratings]);
    return review;
};
export const reviewByUser = async(user_id)=>{
    const review = await db.oneOrNone(queries.reviewExistsByUserId,[user_id]);
    return review;
};
export const reviewBySong = async(song_id)=>{
    const review = await db.oneOrNone(queries.reviewExistsBySong,[song_id]);
    return review;
};
export const reviewById = async(review_id)=>{
    const review = await db.oneOrNone(queries.reviewExistsById,[review_id]);
    return review;
};
export const getComments = async(offset, limit)=>{
    const comments = await db.any(queries.getComments,[parseInt(offset), parseInt(limit)]);
    return comments;
};
export const commentCount = async()=>{
    const comments = await db.oneOrNone(queries.commentCount);
    return comments;
};
