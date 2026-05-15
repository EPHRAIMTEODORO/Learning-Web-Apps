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
    title: "Student Travel Guide | Home",
    activePage: "home",
    ctaText: "Plan a Trip",
    ctaHref: "/destinations"
  });
});

app.get("/destinations", (req, res) => {
  res.render("destinations", {
    title: "Student Travel Guide | Destinations",
    activePage: "destinations",
    ctaText: "Photo Journal",
    ctaHref: "/gallery"
  });
});

app.get("/gallery", (req, res) => {
  res.render("gallery", {
    title: "Student Travel Guide | Gallery",
    activePage: "gallery",
    ctaText: "Start Exploring",
    ctaHref: "/destinations"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
