const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    individualId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Individual",
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Social", Schema);
nhm;
