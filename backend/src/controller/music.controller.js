const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const jwt = require("jsonwebtoken");
const {
  uploadMusicFile,
  uploadImageFile,
} = require("../services/storage.services");

async function create(req, res) {
  const title = req.body.title;
  const audioFile = req.files.audio?.[0];
  const imageFile = req.files.image?.[0];

  const resultMusic = await uploadMusicFile(
    audioFile.buffer.toString("base64"),
  );
  const resultImage = await uploadImageFile(
    imageFile.buffer.toString("base64"),
  );

  const music = await musicModel.create({
    imageUri: resultImage.url,
    musicUri: resultMusic.url,
    title,
    artist: req.user.id,
  });
  res.status(201).json({
    message: "Music created successfully",
    music: {
      id: music._id,
      imageUri: music.imageUri,
      musicUri: music.musicUri,
      title: music.title,
      artist: music.artist,
    },
  });
}

async function createAlbum(req, res) {
  const { title, musics } = req.body;
  const album = await albumModel.create({
    title,
    musics: musics,
    artist: req.user.id,
  });

  res.status(201).json({
    message: "Album created successfully",
    album: {
      id: album._id,
      title: album.title,
      musics: album.musics,
      artist: album.artist,
    },
  });
}

async function getMusic(req, res) {
  const musicId = req.params.musicId;
  const music = await musicModel.findById(musicId);
  res.status(200).json({ message: "Music fetched successfully", music: music });
}

async function getAllMusics(req, res) {
  const musics = await musicModel
    .find()
    .limit(1)
    .populate("artist", "username email");
  //we limit to bring only 1 song, as it takes too much space if we bring all songs at once
  res
    .status(200)
    .json({ nessage: "musics fetched successfully", musics: musics });
}

async function getAllAlbum(req, res) {
  const albums = await albumModel
    .find()
    .select("title artist")
    .populate("artist", "username email");
  //dont want to get musics in response as it would take too much space
  res
    .status(200)
    .json({ message: "Albums fetched successfully", albums: albums });
}

async function getAlbumById(req, res) {
  const albumId = req.params.albumId;
  const album = await albumModel
    .findById(albumId)
    .populate("artist", "username email")
    .populate("musics");
  res.status(200).json({ message: "Album fetched successfully", album: album });
}

module.exports = {
  create,
  createAlbum,
  getMusic,
  getAllMusics,
  getAllAlbum,
  getAlbumById,
};
