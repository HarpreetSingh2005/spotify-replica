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
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  musicController.create,
);
/* Create album: /api/music/album */
router.post("/album", authMiddleware.authArtist, musicController.createAlbum);

/* Get album by id: /api/music/album/:albumId */
router.get(
  "/album/:albumId",
  authMiddleware.authUser,
  musicController.getAlbumById,
);

/* Get all albums: /api/music/album */
router.get("/album", authMiddleware.authUser, musicController.getAllAlbum);

/* Get all musics: /api/music */
router.get("/", /*authMiddleware.authUser,*/ musicController.getAllMusics);

/* Get music by id: /api/music/:musicId */
router.get("/:musicId", authMiddleware.authUser, musicController.getMusic);

module.exports = router;
