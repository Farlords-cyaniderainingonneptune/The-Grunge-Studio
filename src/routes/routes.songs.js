import { Router } from 'express';
import * as songController from '../controllers/controllers.songs.js';
import * as authMiddleware from '../middlewares/middlewares.auth.js';
import * as likesController from '../controllers/controllers.likes_ratings.js'

const router = Router();

router.get('/all',
    songController.songList
);
router.get('/view_song',
    authMiddleware.verifyToken,
    songController.viewSong
);
router.get('/filter_genre',
    songController.genreFilter
);
router.get('/search',
    songController.searchSongs
);
router.post('/new_song',
    authMiddleware.verifyToken,
    songController.addSong
);
app.post('/:song_id/like',
    authMiddleware.verifyToken,
    likesController.likeUnlike
);
app.post('/:song_id/rate',
    authMiddleware.verifyToken,
    likesController.rateSong
);
router.patch('/:song_id',
    authMiddleware.verifyToken,
    songController.editSong
);
router.delete('/:song_id',
    authMiddleware.verifyToken,
    songController.deleteSong
);


export default router;