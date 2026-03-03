import db from "../config/db/index.js";
import queries from "../queries/queries.likes_ratings.js";

export const likeComment= async(comment_id)=>{
    const likes = await db.oneOrNone(queries.likeComment,[comment_id])
    return likes;
}
export const unlikeComment= async(comment_id)=>{
    const likes = await db.oneOrNone(queries.unlikeComment,[comment_id])
    return likes;
}
export const rateSong= async(song_id, user_id, rating_value)=>{
    const rating = await db.oneOrNone(queries.rateSong,[song_id, user_id, parseInt(rating_value)])
    return rating;
}
export const likeReview= async(id, song_id)=>{
    const like = await db.oneOrNone(queries.likeReview,[id, song_id])
    return like;
};
export const unlikeReview= async(id, song_id)=>{
    const unlike = await db.oneOrNone(queries.unlikeReview,[id, song_id])
    return unlike;
};
export const likeSong= async(id, song_id)=>{
    const like = await db.oneOrNone(queries.likeSong,[id, song_id])
    return like;
};
export const unlikeSong= async(id, song_id)=>{
    const unlike = await db.oneOrNone(queries.unlikeSong,[id, song_id])
    return unlike;
};