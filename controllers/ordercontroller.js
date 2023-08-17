const Order = require("../models/ordermodel");
const Product = require("../models/productmodels");
const catchasyncerrors = require("../middelware/catchasyncerror");
const Errorhandler = require("../utils/errorhandler");
//create new order
exports.neworder = catchasyncerrors(async (req, res, next) => {
  const { shippinginfo, orderitems, itemsprice, shippingprice, totalprice } =
    req.body;
  const order = await Order.create({
    shippinginfo,
    orderitems,
    itemsprice,
    shippingprice,
    totalprice,
    paidat: Date.now(),
    user: req.user._id,
  });
  res.status(200).json({
    success: true,
    order,
  });
});
//get single order
exports.getsingleorder = catchasyncerrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new Errorhandler("order not found", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

//get logged in user order
exports.myorder = catchasyncerrors(async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//get all order --admin
exports.getallorder = catchasyncerrors(async (req, res, next) => {
  const orders = await Order.find();
  let totalammount = 0;
  orders.forEach((order) => {
    totalammount += order.totalprice;
  });
  res.status(200).json({
    success: true,
    totalammount,
    orders,
  });
});

//update order status --admin
exports.updateorderstatus = catchasyncerrors(async (req, res, next) => {
  const orders = await Order.findById(req.params.id);

  if (orders.orderstatus === "delivered") {
    return next(new Errorhandler("you have already order this order", 404));
  }

  orders.orderitems.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });

  orders.orderstatus = req.body.status;

  if (req.body.status === "delivered") {
    orders.deliveredat = Date.now();
  }
  await orders.save({
    validateBeforeSave: false,
  });
  res.status(200).json({
    success: true,
  });
});
async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}
//delete order  ---admin

exports.deleteorder = catchasyncerrors(async (req, res, next) => {
  const orders = await Order.findById(req.params.id);
  if (!orders) {
    return next(new Errorhandler("order not found with this id", 404));
  }
  await orders.remove();
  res.status(200).json({
    success: true,
  });
});
