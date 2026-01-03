// npm i axios archiver fs
const axios = require("axios");
const fs = require("fs");
const archiver = require("archiver");

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const BASE_URL =
  "https://www.abcmouse.com/learn/wp-content/uploads/2024/05/ET-Letter-[Alphabet]-Featured-Image.png";

const output = fs.createWriteStream("alphabet.zip");
const archive = archiver("zip", { zlib: { level: 9 } });

archive.pipe(output);

(async () => {
  for (const letter of letters) {
    const url = BASE_URL.replace("[Alphabet]", letter);

    try {
      const res = await axios.get(url, {
        responseType: "arraybuffer",
      });

      archive.append(res.data, { name: `${letter}.png` });
      console.log("Downloaded:", letter);
    } catch (err) {
      console.log("Failed:", letter);
    }
  }

  await archive.finalize();
  console.log("ZIP created: alphabet.zip");
})();