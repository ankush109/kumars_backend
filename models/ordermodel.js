const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        name: {
          type: String,
        },

        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
        images: String,

        product: {
          type: mongoose.ObjectId,
          ref: "product",
        },
      },
    ],
    user: {
      type: mongoose.ObjectId,
      ref: "user",
      required: true,
    },
    payment: {},

    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
