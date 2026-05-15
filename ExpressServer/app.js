const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.static(path.join(__dirname, "public")));

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

app.get("/tips", async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, "data", "travelTips.json");
    const fileContents = await fs.readFile(filePath, "utf-8");
    const travelTips = JSON.parse(fileContents);

    res.render("tips", {
      title: "Student Travel Guide | Travel Tips",
      activePage: "tips",
      ctaText: "View Gallery",
      ctaHref: "/gallery",
      travelTips
    });
  } catch (error) {
    next(error);
  }
});

// This middleware runs only if none of the routes above matched the request.
// It belongs near the bottom so Express gets a chance to check every real page first.
app.use((req, res) => {
  res.status(404).render("404", {
    title: "404 Page Not Found | Student Travel Guide",
    activePage: "",
    ctaText: "Go Home",
    ctaHref: "/",
    requestedUrl: req.originalUrl
  });
});

// General error-handling middleware catches real server errors, such as a broken JSON file.
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).render("500", {
    title: "Server Error | Student Travel Guide",
    activePage: "",
    ctaText: "Go Home",
    ctaHref: "/"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
