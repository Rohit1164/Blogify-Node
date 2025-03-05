require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const blog = require("./models/blog");

const useRouter = require("./Router/user");
const blogRouter = require("./Router/blog");
const {
  checkForAuthenticationCookies,
} = require("./middleware/authentication");

const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./view"));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookies("token"));
app.use(express.static(path.resolve("./public")));

// Routes
app.get("/", async (req, res) => {
  const allblogs = await blog.find({});
  res.render("home", {
    user: req.user || null,
    blogs: allblogs || null,
  });
});

app.use("/user", useRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
