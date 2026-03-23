const express = require("express");
const musicController = require("../controller/music.controller");
const multer = require("multer");
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

/* Create music: /api/music/upload */
router.post("/upload", upload.single("music"), musicController.create);

module.exports = router;
