const express = require("express");

// create a Router instance (call the function)
const router = express.Router();

const individualController = require("../controller/Individual");

router.post(
  "/create",
  individualController.createIndiviual.bind(individualController)
);

router.get(
  "/getAll",
  individualController.getAllIndividual.bind(individualController)
);

module.exports = router;
