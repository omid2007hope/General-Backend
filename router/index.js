const express = require("express");

// create a Router instance (call the function)
const router = express.Router();

// Import the Individual file from the router folder

const Individual = require("./Individual");

router.get("/", (req, res) => {
  res.send("server is running");
});

router.use("/Individual", Individual);

// version 1 of app

// router.use("/panel", panel);

module.exports = router;
