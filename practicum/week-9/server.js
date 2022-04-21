let { store } = require("./data_access/store");
const express = require("express");
const e = require("express");
const { response } = require("express");
const app = express();
const port = process.env.PORT || 4002;

//dependencies
const cors = require("cors");

//middlewares
app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.status(200).json({
    done: true,
    message: "Welcome to imagequiz backend API",
  });
});

app.get("/flowers", function (req, res) {
  store
    .getFlowers()
    .then((x) => {
      res.status(200).json({
        done: true,
        result: x.rows,
        message: "Flowers found in database.",
      });
    })
    .catch((e) => {
      res.status(404).json({ done: false, message: "Something went wrong." });
    });
});

app.get("/quiz/:id", function (req, res) {
  store
    .getQuiz()
    .then((x) => {
      res.status(200).json({
        done: true,
        result: x.rows,
        message: "Quiz found.",
      });
    })
    .catch((e) => {
      res.status(404).json({ done: false, message: "Something went wrong." });
    });
});

app.get("/scores/:quiztaker/:quizid", function (req, res) {
  store
    .getQuiz()
    .then((x) => {
      res.status(200).json({
        done: true,
        result: x.rows,
        message: "Score(s) found.",
      });
    })
    .catch((e) => {
      res.status(404).json({ done: false, message: "Something went wrong." });
    });
});

app.post("/register", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var pwd = req.body.password;
  store
    .addCustomer(name, email, pwd)
    .then((x) =>
      res
        .status(200)
        .json({ done: true, message: "Customer added successfully" })
    )
    .catch((e) => {
      console.log(e);
      res.status(500).json({
        done: false,
        message: "Customer was not added due to an error.",
      });
    });
});

app.post("/login", (req, res) => {
  var email = req.body.email;
  var pwd = req.body.password;
  console.log(email);
  console.log(pwd);
  store
    .login(email, pwd)
    .then((x) => {
      if (x.valid) {
        res
          .status(200)
          .json({ done: true, message: "Customer logged in successfully." });
      } else {
        res.status(401).json({ done: false, message: x.message });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ done: false, message: "Something went wrong." });
    });
});

app.post("/score", (req, res) => {
  var quizTaker = req.body.quizTaker;
  var id = req.body.quizId;
  var score = req.body.score;
  var date = new Date().toJSON().slice(0, 10).replace(/-/g, "-");
  var time = new Date(0);
  time.setSeconds(45); // specify value for SECONDS here
  var timeString = time.toISOString().substr(11, 8);
  store
    .addScore(quizTaker, id, score, date + " " + timeString)
    .then((x) => {
      console.log(x);
      res
        .status(200)
        .json({ done: true, message: "Score added successfully." });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ done: false, message: "Something went wrong." });
    });
});

app.listen(port, () => console.log("App listening on port 4002"));
