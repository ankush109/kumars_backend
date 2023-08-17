const express =require("express");
const router =express.Router()
const { neworder, myorder, getsingleorder, getallorder, updateorderstatus, deleteorder } = require("../controllers/ordercontroller");

const {isauthenticateduser,authorizeroles} = require("../middelware/auth");


router.route("/order/new").post(isauthenticateduser,neworder)
router.route("/order/:id").get(isauthenticateduser,getsingleorder)

router.route("/orders/me").get(isauthenticateduser,myorder)
router.route("/admin/orders").get(isauthenticateduser,authorizeroles("admin"),getallorder)
router.route("/admin/orders/:id").put(isauthenticateduser,authorizeroles("admin"),updateorderstatus).delete(isauthenticateduser,authorizeroles("admin"),deleteorder)
module.exports =router