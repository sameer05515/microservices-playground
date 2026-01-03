// npm i axios fs archiver
const axios = require("axios");
const fs = require("fs");
const archiver = require("archiver");

const urls = [
  // paste image URLs you find manually from DevTools
  "https://www.abcmouse.com/learn/wp-content/uploads/2024/03/ET-Letter-A-Featured-Image-vs2.png",
  "https://www.abcmouse.com/learn/wp-content/uploads/2024/03/ET-Letter-B-Featured-Image.png",
  "https://www.abcmouse.com/learn/wp-content/uploads/2024/04/Letter-C-Featured-Image.png",
  "https://www.abcmouse.com/learn/wp-content/uploads/2024/04/Letter-D-Featured-Image-png.png",
  ""

];

(async () => {
  const output = fs.createWriteStream("alphabets.zip");
  const archive = archiver("zip");

  archive.pipe(output);

  for (let i = 0; i < urls.length; i++) {
    const res = await axios.get(urls[i], { responseType: "arraybuffer" });
    const letter = String.fromCharCode(65 + i);
    archive.append(res.data, { name: `${letter}.png` });
  }

  await archive.finalize();
})();