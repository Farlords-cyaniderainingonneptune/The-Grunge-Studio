import { Router } from 'express';
import * as songController from '../controllers/controllers.songs.js';
import * as authMiddleware from '../middlewares/middlewares.auth.js';
const router = Router();

router.get('/songs',
    songController.songList
);
router.get('/view_songs/:song_id',
    authMiddleware.verifyToken,
    songController.viewSong
);
router.get('/filter_genre',
    songController.genreFilter
);
router.get('/search',
    songController.searchSongs
);
router.post('/song',
    authMiddleware.verifyToken,
    songController.addSong
);
router.patch('/songs/:song_id',
    authMiddleware.verifyToken,
    songController.editSong
);
router.delete('/songs/:song_id',
    authMiddleware.verifyToken,
    songController.deleteSong
);


export default router;