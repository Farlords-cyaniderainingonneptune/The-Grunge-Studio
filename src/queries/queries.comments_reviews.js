export default{
    postComment: `
        INSERT INTO blog_post_comments (post_id, user_id, comment) 
        VALUES ($1, $2, $3) 
        RETURNING id, post_id, comment, views_count, likes_count, is_deleted, created_at`,
    likePost: `
    UPDATE blog_posts SET updated_at = NOW(), 
    likes_count = likes_count + 1, 
    views_count= views_count + 1 
    WHERE id = $1 
    RETURNING id, title, content, status, likes_count, views_count`,
    unlikePost: 'UPDATE blog_posts SET updated_at = NOW(), likes_count = likes_count - 1 WHERE id = $1 RETURNING id, title, content, status, likes_count, views_count',
}