require("dotenv").config({ path: ".env" });
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = process.env.PORT;
console.log(port);
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("accept", "application/json");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  req.headers["Authorization"] = `Bearer ${process.env.YELP_CLIENT_ID}`;
  next();
});
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.use(
  bodyParser.json({
    limit: "50mb",
    extended: true,
  })
);

app.get("/api/yelp-search", async (req, res) => {
  try {
    const searchTerm = req.query.term;
    const location = req.query.location;
    const limit = req.query.limit || 20;
    console.log("location", location);
    console.log("searchTerm", searchTerm);
    console.log("limit", limit);

    const clientId = process.env.YELP_CLIENT_ID;
    const apiKey = process.env.YELP_API_KEY;
    const response = await axios.get(
      "https://api.yelp.com/v3/businesses/search",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        params: {
          term: searchTerm,
          location: location,
          limit: limit, // Return a maximum of 20 entries
        },
      }
    );
    console.log("response", response);

    const businesses = response.data.businesses;

    res.json(businesses);
  } catch (error) {
    console.error("Error fetching Yelp data:", error.message);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
