const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

const usersDB = [
  {
    email: "test@test.com",
    password: "test",
    name: "test",
    gender: "male",
    age: 32,
  },
];

app.get("/login", (req, res) => {
  // check if cookie set
  // if cookie set then redirect to home page

  if (req.cookies.email) {
    res.redirect("/");
  } else {
    res.sendFile(path.join(__dirname, "./public/login2.html"));
  }
});

app.get("/", (req, res) => {
  // check if cookie set
  // if cookie set then redirect to home page

  if (req.cookies.email) {
    res.sendFile(path.join(__dirname, "./public/mainpage.html"));
  } else {
    res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  if (req.cookies.email) {
    res.redirect("/");
  } else {
    res.sendFile(path.join(__dirname, "./public/reg.html"));
  }
});

app.post("/login", async (req, res) => {
  // check if user exists in db list
  // if user exists then redirect to home page
  // else redirect to login page

  // get from form

  console.log(req.body);

  const userEmail = req.body.email;
  const password = req.body.password;
  const user = usersDB.find((user) => user.email === userEmail);

  console.log(user);

  if (user && user.password === password) {
    res.cookie("email", userEmail);
    res.redirect("/");
  } else {
    res.status(401).send("Invalid Credentials");
  }
});

app.post("/register", async (req, res) => {
  // check if user exists in db list
  // if user exists then redirect to login page
  // else redirect to register page

  // get from form

  console.log(req.body);

  const userEmail = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const age = req.body.age;
  const gender = req.body.gender;

  const user = usersDB.find((user) => user.email === userEmail);

  if (user) {
    res.status(400).send("User already exists");
  } else {
    usersDB.push({
      email: userEmail,
      password: password,
      gender: gender,
      age: age,
      name: name,
    });

    res.redirect("/login");
  }
});

// logout
app.post("/logout", (req, res) => {
  res.clearCookie("email");

  // redicrect to login page
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Server is up on port " + port + ".");
});
