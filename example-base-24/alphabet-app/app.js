const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

app.get("/", (req, res) => {
  res.render("index", { alphabets });
});

app.get("/alphabet/:letter", (req, res) => {
  const letter = req.params.letter.toUpperCase();

  if (!alphabets.includes(letter)) {
    return res.send("Invalid letter");
  }

  const index = alphabets.indexOf(letter);

  res.render("alphabet", {
    letter,
    wordMap: {
      A: "Apple", B: "Ball", C: "Cat", D: "Dog",
      E: "Elephant", F: "Fish", G: "Goat", H: "Hat",
      I: "Ice Cream", J: "Jug", K: "Kite", L: "Lion",
      M: "Monkey", N: "Nest", O: "Orange", P: "Parrot",
      Q: "Queen", R: "Rabbit", S: "Sun", T: "Tiger",
      U: "Umbrella", V: "Van", W: "Watch", X: "Xylophone",
      Y: "Yak", Z: "Zebra"
    }[letter],
    prev: alphabets[index - 1],
    next: alphabets[index + 1]
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});