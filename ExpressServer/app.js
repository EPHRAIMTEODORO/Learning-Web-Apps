const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Home"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});