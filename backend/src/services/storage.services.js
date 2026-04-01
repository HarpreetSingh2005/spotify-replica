const ImageKit = require("@imagekit/nodejs");

const ImageKitClient = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadMusicFile(audioFile) {
  try {
    const result = await ImageKitClient.files.upload({
      file: audioFile,
      fileName: "music_" + Date.now(),
      folder: "spotify-replica/music",
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}
function uploadImageFile(imageFile) {
  try {
    const result = ImageKitClient.files.upload({
      file: imageFile,
      fileName: "image_" + Date.now(),
      folder: "spotify-replica/image",
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  uploadImageFile,
  uploadMusicFile,
};
