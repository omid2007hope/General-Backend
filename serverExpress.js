// Import express

const express = require("express");

// Import the router and the Utils

const router = require("./router");
const util = require("./Utils");

// const app is the same as express()

const app = express();

// Conect the backend to the database

util.connectToDatabase().catch((err) => {
  // Catch an error

  console.error("Failed to connect to database:", err);
});

// parse JSON and URL-encoded bodies BEFORE defining/using routes
app.use(express.json({ type: "application/json" })); // enables req.body for JSON
app.use(express.urlencoded({ extended: true })); // enables req.body for form submissions

// mount router (order after middleware and route definitions is fine)
app.use(router);

// start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
