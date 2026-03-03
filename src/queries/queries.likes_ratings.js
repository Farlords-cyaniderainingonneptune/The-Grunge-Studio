export default {
    likeComment:`
    UPDATE review_comments 
    SET updated_at = NOW(), 
    likes_count = likes_count + 1
    WHERE comment_id = $1
    RETURNING comment_id, review_id,
    likes_count, views_count`,

    unlikeComment: `UPDATE review_comments 
    SET updated_at = NOW(), 
    likes_count = GREATEST (0, likes_count - 1)
    WHERE comment_id = $1 
    RETURNING comment_id, review_id`,

    rateSong:`
    UPDATE song_ratings
    SET updated_at = NOW(),
    rating_value = $3
    WHERE song_id = $1 AND user_id = $2
    `,
    likeReview:`
    UPDATE song_reviews
    SET updated_at = NOW(),
    likes_count = likes_count+1
    WHERE id = $1 AND song_id = $2
    RETURNING updated_at, likes_count, review_content
    `,
    unlikeReview:`
    UPDATE song_reviews
    SET updated_at = NOW,
    likes_count = GREATEST (0, likes_count - 1)
    WHERE id = $1 AND song_id = $2
    RETURNING updated_at, likes_count, review_content
    `,
    likeSong: `
    UPDATE studio_songs
    SET updated_at = NOW(),
    likes_count = likes_count+1
    WHERE id = $1 AND is_deleted = false
    RETURNING updated_at, likes_count, song_title
    `,
    unlikeSong:`
    UPDATE studio_songs
    SET updated_at = NOW(),
    likes_count = GREATEST(0, likes_count - 1)
    WHERE id = $1 AND is_deleted = false
    RETURNING updated_at, likes_count, song_title
    `
}