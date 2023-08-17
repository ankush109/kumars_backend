const express = require("express");

const router = express.Router();
const { isauthenticateduser } = require("../middelware/auth");
const {
  braintreeTokenController,
  brainTreePaymentController,
} = require("../controllers/productcontroller");
router
  .route("/braintree/token")
  .get(isauthenticateduser, braintreeTokenController);
router
  .route("/braintree/payment")
  .post(isauthenticateduser, brainTreePaymentController);
module.exports = router;
