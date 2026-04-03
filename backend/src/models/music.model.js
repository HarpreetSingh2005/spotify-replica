const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
  {
    imageUri: {
      type: String,
      required: true,
    },
    musicUri: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }, //useful for latest albums and musics
);

const musicModel = mongoose.model("Music", musicSchema);
module.exports = musicModel;
