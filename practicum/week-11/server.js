let { store } = require("./data_access/store");
const express = require("express");
var passport = require("passport");
var LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
var session = require("express-session");
var SQLiteStore = require("connect-sqlite3")(session);
const e = require("express");
const { response } = require("express");
const app = express();
const port = process.env.PORT || 4002;

//dependencies
const cors = require("cors");

//middlewares
app.use(cors());
app.use(express.json());

passport.use(
  new LocalStrategy({ usernameField: "email" }, function verify(
    username,
    password,
    cb
  ) {
    store
      .login(username, password)
      .then((x) => {
        if (x.valid) {
          return cb(null, x.user);
        } else {
          return cb(null, false, { message: "Incorrect username or password" });
        }
      })
      .catch((e) => {
        console.log(e);
        cb("Something went wrong!");
      });
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4002/auth/google/callback",
      passReqToCallback: true,
    },
    function(request, accessToken, refreshToken, profile, done) {
      console.log("in Google strategy:");
      store
        .findOrCreateNonLocalCustomer(
          profile.displayName,
          profile.email,
          profile.id,
          profile.provider
        )
        .then((x) => done(null, x))
        .catch((e) => {
          console.log(e);
          return done("Something went wrong.");
        });
    }
  )
);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./sessions" }),
  })
);
app.use(passport.authenticate("session"));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

app.get("/", function(req, res) {
  res.status(200).json({
    done: true,
    message: "Welcome to imagequiz backend API",
  });
});

app.get("/flowers", function(req, res) {
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

app.get("/quiz/:id", function(req, res) {
  if (!req.isAuthenticated()) {
    res.status(401).json({ done: false, message: "Please login first" });
  }
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

app.get("/scores/:quiztaker/:quizid", function(req, res) {
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

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/login/succeeded",
    failureRedirect: "/login/failed",
  })
);

app.get("/login/succeeded", (request, response) => {
  response
    .status(200)
    .json({ done: true, message: "Welcome to hello world backend API" });
});

app.get("/login/failed", (request, response) => {
  response.status(401).json({ done: false, message: "Credentials not valid" });
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

app.get("auth/google/success", (request, response) => {
  console.log(request.user);
  response.redirect(
    `http://localhost:4002/#/google/${request.user.username}/${request.user.name}`
  );
});

app.get("auth/google/failure", (request, response) => {
  response.redirect(`http://localhost:4002/#/google/failed`);
});

app.get("/isloggedin", (request, response) => {
  if (request.isAuthenticated()) {
    response.status(200).json({ done: true, result: true });
  } else {
    response.status(401).json({ done: false, result: false });
  }
});

app.get(
  "/auth/google/callback/",
  passport.authenticate("google", {
    successRedirect: "auth/google/success",
    failureRedirect: "auth/google/failure",
  })
);

app.post("/logout", function(req, res) {
  req.logout();
  res.json({ done: true, message: "Customer signout success" });
});

app.post("/score", (req, res) => {
  var quizTaker = req.body.quizTaker;
  var id = req.body.quizId;
  var score = req.body.score;
  var date = new Date()
    .toJSON()
    .slice(0, 10)
    .replace(/-/g, "-");
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
