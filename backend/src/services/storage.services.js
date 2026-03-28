const ImageKit = require("@imagekit/nodejs");

const ImageKitClient = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(file) {
  try {
    const result = await ImageKitClient.files.upload({
      file: file,
      fileName: "music_" + Date.now(),
      folder: "spotify-replica/music",
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  uploadFile,
};
