const Purchase = require('./../models/purchase');
const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');

// exports.setBookUserIds = (req, res, next) => {
//   // Allow nested routes
//   if (!req.body.book) req.body.book = req.params.bookId;
//   if (!req.body.user) req.body.user = req.user.id;
//   next();
// };

exports.getAllPurchases = factory.getAll(Purchase);
exports.getPurchase = factory.getOne(Purchase);
exports.createPurchase = factory.createOne(Purchase);
exports.updatePurchase = factory.updateOne(Purchase);
exports.deletePurchase = factory.deleteOne(Purchase);
