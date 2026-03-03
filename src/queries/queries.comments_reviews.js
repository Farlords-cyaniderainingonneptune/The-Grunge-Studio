export default{
    postComment: `
        INSERT INTO review_comments (review_id, user_id, comment) 
        VALUES ($1, $2, $3) 
        RETURNING comment_id, review_id, comment, views_count, likes_count, is_deleted, created_at`,
    commenter:`
    SELECT rs.review_id, u.user_name AS username,
    rs.likes_count
    FROM review_comments rs
    JOIN studio_users u ON rs.user_id = u.user_id
    WHERE rs.comment_id = $1
    AND rs.is_deleted = false
    `,
    commentExistsById:`
    SELECT review_id, comment, likes_count FROM review_comments
    WHERE comment_id = $1
    `,
    commentExistsByUserId: `
    SELECT user_id, review_id, comment, likes_count FROM review_comments
    WHERE user_id = $1
    `,
    commentExistsByReview: `
    SELECT user_id, review_id, comment, likes_count FROM review_comments
    WHERE review_id = $1
    `,
    editComment: `
     UPDATE review_comments
     SET updated_at = NOW(),
     comment = $3
     WHERE comment_id = $1 AND user_id = $2
    `,
    deleteComment:`
    DELETE comment from review_comments
    WHERE comment_id = $1 AND user_id = $2
    `,

    reviewSong: `
    INSERT INTO song_reviews (review_content, ratings)
    VALUES ($1, $2,)
    RETURNING user_id, song_id, ratings, review_content, created_at
    `,
    editReview:`
    UPDATE song_reviews
    SET updated_at = NOW(),
    review_content = $3,
    ratings = $4
    WHERE review_id = $1 AND user_id = $2
    `,
    reviewExistsByUserId:`
    SELECT review_id, song_id, review_content, ratings FROM song_reviews
    WHERE user_id = $1
    `,
    reviewExistsBySong:`
    SELECT review_id, song_id, review_content, ratings FROM song_reviews
    WHERE song_id = $1
    `,
    reviewExistsById:`
    SELECT review_id, song_id, review_content, ratings FROM song_reviews
    WHERE review_id = $1
    `,
    getComments:`
    SELECT * FROM review_comments
    WHERE is_deleted = false
    ORDER BY created_at DESC
    OFFSET $1
    LIMIT $2
    `,
    commentCount:`
    SELECT COUNT(id) FROM review_comments WHERE is_deleted=false
    `
}