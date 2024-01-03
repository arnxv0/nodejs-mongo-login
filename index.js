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
    password: "test123",
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

// logout
app.post("/logout", (req, res) => {
  res.clearCookie("email");

  // redicrect to login page
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Server is up on port " + port + ".");
});
