const express = require("express");
const musicController = require("../controller/music.controller");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

/* Create music: /api/music/upload */
router.post(
  "/upload",
  authMiddleware.authArtist,
  upload.single("music"),
  musicController.create,
);
/* Create album: /api/music/album */
router.post("/album", authMiddleware.authArtist, musicController.createAlbum);

/* Get all musics: /api/music */
router.get("/", authMiddleware.authUser, musicController.getAllMusics);

/* Get all albums: /api/music/album */
router.get("/album", authMiddleware.authUser, musicController.getAllAlbum);

/* Get album by id: /api/music/album/:albumId */
router.get(
  "/album/:albumId",
  authMiddleware.authUser,
  musicController.getAlbumById,
);

module.exports = router;
