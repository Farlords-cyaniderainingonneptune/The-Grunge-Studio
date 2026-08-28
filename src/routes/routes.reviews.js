import { Router } from 'express';
import * as authMiddleware from '../middlewares/middlewares.auth.js';
import * as commentsController from '../controllers/controllers.comments_reviews.js';
import * as likesController from '../controllers/controllers.likes_ratings.js';

const router = Router();

// create a review for a song
router.post('/:song_id/review',
    authMiddleware.verifyToken,
    commentsController.review
);
// comment on a review
router.post('/:review_id/comment',
    authMiddleware.verifyToken,
    commentsController.commentReview
);
// comment on a comment (reply to a comment)
router.post('/comments/:comment_id/comment',
    authMiddleware.verifyToken,
    commentsController.commentComment
);
// like/unlike a review
router.post('/:review_id/like',
    authMiddleware.verifyToken,
    likesController.likeUnlike
);
// like/unlike a comment
router.post('/:comment_id/like',
    authMiddleware.verifyToken,
    likesController.likeUnlike
);
// edit a review (only the owner of the review can edit it)
router.patch('/:review_id',
    authMiddleware.verifyToken,
    commentsController.editReview
);
// view all comments (paginated)
router.get('/comments',
    commentsController.getComments
);
// edit a comment (only the owner of the comment can edit it)
router.patch('/comments/:comment_id',
    authMiddleware.verifyToken,
    commentsController.editComment
);
// delete a comment (only the owner of the comment can delete it)
router.delete('/comments/:comment_id',
    authMiddleware.verifyToken,
    commentsController.deleteComment
);
export default router;

