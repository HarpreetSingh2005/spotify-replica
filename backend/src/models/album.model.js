const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUri: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: "",
      trim: true,
    },
    musics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Music",
      },
    ],
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const albumModel = mongoose.model("Album", albumSchema);
module.exports = albumModel;
