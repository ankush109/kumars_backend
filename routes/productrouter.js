const express = require("express");
const {
  getallproducts,
  createproduct,
  updateproduct,
  deleteproduct,
  getproductdetails,
  createproductreview,
  getprodutreviews,
  deleteproductreview,
  getallproductsop,
  getallproductsadmin,
} = require("../controllers/productcontroller");
const { isauthenticateduser, authorizeroles } = require("../middelware/auth");
const router = express.Router();

router.route("/products").get(getallproducts);
router
  .route("/products/new")
  .post(isauthenticateduser, authorizeroles("admin"), createproduct);
router
  .route("/products/:id")
  .put(isauthenticateduser, authorizeroles("admin"), updateproduct)
  .delete(isauthenticateduser, authorizeroles("admin"), deleteproduct);
router.route("/product/:id").get(getproductdetails);
router.route("/review").put(isauthenticateduser, createproductreview);
router.route("/allproducts").get(getallproductsop);
router
  .route("/reviews")
  .get(getprodutreviews)
  .delete(isauthenticateduser, deleteproductreview);
router
  .route("/admin/products")
  .get(isauthenticateduser, authorizeroles("admin"), getallproductsadmin);
module.exports = router;
