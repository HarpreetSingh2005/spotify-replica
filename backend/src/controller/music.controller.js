const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const jwt = require("jsonwebtoken");
const {
  uploadMusicFile,
  uploadImageFile,
} = require("../services/storage.services");

async function create(req, res) {
  try {
    const title = req.body.title;
    const audioFile = req.files.audio?.[0];
    const imageFile = req.files.image?.[0];
    if (!audioFile || !title || !imageFile) {
      return res.status(400).json({
        success: false,
        message: "Music audio, title and image is required",
      });
    }

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
      success: true,
      music: {
        id: music._id,
        imageUri: music.imageUri,
        musicUri: music.musicUri,
        title: music.title,
        artist: music.artist,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function createAlbum(req, res) {
  try {
    console.log(req.body);
    const { title, musics, description } = req.body;
    const imageFile = req.files?.image?.[0];

    let parsedMusics = musics;
    if (typeof musics === "string") {
      parsedMusics = JSON.parse(musics);
    }

    if (!title || !musics) {
      return res.status(400).json({
        success: false,
        message: "Title and songs are required",
      });
    }
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Album image is required",
      });
    }

    const resultImage = await uploadImageFile(
      imageFile.buffer.toString("base64"),
    );

    const album = await albumModel.create({
      title,
      imageUri: resultImage.url,
      description: description || "",
      musics: parsedMusics,
      artist: req.user.id,
    });
    const populatedAlbum = await albumModel
      .findById(album._id)
      .populate("artist", "username email")
      .populate("musics");

    return res.status(201).json({
      success: true,
      data: populatedAlbum,
    });
  } catch (error) {
    console.error("Create album error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create album",
    });
  }
}

async function searchMusic(req, res) {
  try {
    const { q = "", page = 1, limit = 20 } = req.query;
    console.log("Searching music...");
    const skip = (Number(page) - 1) * Number(limit);

    const musics = await musicModel
      .find({
        title: {
          $regex: q,
          $options: "i",
        } /* q is the search query and i for case insensitive */,
      })
      .populate("artist", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await musicModel.countDocuments({
      title: {
        $regex: q,
        $options: "i",
      },
    });

    return res.status(200).json({
      success: true,
      data: musics,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        hasMore: skip + musics.length < total,
      },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to search music" });
  }
}

async function getAllMusics(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const musics = await musicModel
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  // .populate("artist", "username email");
  //we limit to bring only 1 song, as it takes too much space if we bring all songs at once

  const total = await musicModel.countDocuments();
  res.status(200).json({
    success: true,
    data: musics,
    pagination: {
      page: page,
      limit: limit,
      total: musics.length,
      hasMore: skip + musics.length < total,
    },
  });
}

async function getAllAlbum(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const albums = await albumModel
    .find()
    .skip(skip)
    .limit(limit)
    .populate("artist", "username email")
    .sort({ createdAt: -1 });

  const total = await albumModel.countDocuments();
  //dont want to get musics in response as it would take too much space
  res.status(200).json({
    success: true,
    data: albums,
    pagination: {
      page: page,
      limit: limit,
      total: albums.length,
      hasMore: skip + albums.length < total,
    },
  });
}

async function searchAlbums(req, res) {
  try {
    const { q = "", page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const albums = await albumModel
      .find({
        title: { $regex: q, $options: "i" },
      })
      .populate("artist", "username")
      .populate("musics")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await albumModel.countDocuments({
      title: { $regex: q, $options: "i" },
    });

    return res.status(200).json({
      success: true,
      data: albums,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        hasMore: skip + albums.length < total,
      },
    });
  } catch (error) {
    console.error("Search albums error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search albums",
    });
  }
}

async function getAlbumById(req, res) {
  const albumId = req.params.albumId;
  const album = await albumModel
    .findById(albumId)
    .populate("artist", "username email")
    .populate("musics");
  res.status(200).json({ success: true, data: album });
}

module.exports = {
  create,
  createAlbum,
  searchMusic,
  getAllMusics,
  getAllAlbum,
  searchAlbums,
  getAlbumById,
};
