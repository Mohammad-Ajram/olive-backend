const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      required: true,
      type: Number,
    },
    address: {
      type: String,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    avgPrice: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: [
        "agricultural",
        "residential",
        "commercial",
        "industrial",
        "mixedUse",
        "specialPurpose",
      ],
    },
    topProperty: {
      type: Boolean,
      required: true,
    },
    images: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
