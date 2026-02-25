export default {
    likeComments:`
    UPDATE review_comments 
    SET updated_at = NOW(), 
    likes_count = likes_count + 1
    WHERE comment_id = $1
    RETURNING comment_id, review_id,
    likes_count, views_count`,

    unlikeComments: `UPDATE review_comments 
    SET updated_at = NOW(), 
    likes_count = GREATEST (0, likes_count - 1)
    WHERE comment_id = $1 
    RETURNING comment_id, review_id`,

}