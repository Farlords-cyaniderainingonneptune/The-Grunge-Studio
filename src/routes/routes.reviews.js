import { Router } from 'express';
import * as authMiddleware from '../middlewares/middlewares.auth.js';
import * as commentsController from '../controllers/controllers.comments_reviews.js';
import * as likesController from '../controllers/controllers.likes_ratings.js';

// import * as passwordController from '../controllers/controllers.password.js';
const router = Router();

router.post('/:song_id/comment',
    authMiddleware.verifyToken,
    commentsController.commentSong);
router.post('/:song_id/review',
    authMiddleware.verifyToken,
    commentsController.Review
);
router.post('/:review_id/comment',
    authMiddleware.verifyToken,
    commentsController.commentReview
);
router.post('/:comment_id/comment',
    authMiddleware.verifyToken,
    commentsController.commentComment
);
router.post('/:review_id/like',
    authMiddleware.verifyToken,
    likesController.likeUnlike
);
router.post('/:comment_id/like',
    authMiddleware.verifyToken,
    likesController.likeUnlike
);
router.patch('/:review_id',
    authMiddleware.verifyToken,
    commentsController.editReview
);
router.get('/comments',
    commentsController.getComments
);
router.patch('/:comment_id',
    authMiddleware.verifyToken,
    commentsController.editComment
)
router.delete('/:comment_id',
    authMiddleware.verifyToken,
    commentsController.deleteComment
);
export default router;

