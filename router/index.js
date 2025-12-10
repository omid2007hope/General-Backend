const express = require("express");

// create a Router instance (call the function)
const router = express.Router();

// mount router (order after middleware and route definitions is fine)

const { collect } = require("../controller");

router.post("/", collect);

router.get("/", (req, res) => {
  res.send("server is running");
});

// version 1 of app

// router.use("/panel", panel);

module.exports = router;
