import { Router } from 'express';
import * as songController from '../controllers/controllers.songs.js';
import * as authMiddleware from '../middlewares/middlewares.auth.js';
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
router.patch('/song/:song_id',
    authMiddleware.verifyToken,
    songController.editSong
);
router.delete('/song/:song_id',
    authMiddleware.verifyToken,
    songController.deleteSong
);


export default router;