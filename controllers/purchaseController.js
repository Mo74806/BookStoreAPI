const Purchase = require('./../models/purchase');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');

// exports.setBookUserIds = (req, res, next) => {
//   // Allow nested routes
//   if (!req.body.book) req.body.book = req.params.bookId;
//   if (!req.body.user) req.body.user = req.user.id;
//   next();
// };

const stripe = require('stripe')(
  'sk_test_51MWMseAAtmvqepsF6OA2jIlH2MAGM7U9AYRVStf69HPY2v9FhVIAFhOZbzrdNs5SpWiKXzGRaPeFNX7nXKXaeiIl00w0R6bIzI'
);
const catchAsync = require('../utils/catchAsync');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const purchase = await Purchase.findById(req.params.purchaseId).populate(
    'items'
  );
  let { items } = purchase;
  // console.log(purchase);
  items = items.map((item) => {
    return {
      quantity: 1,
      price_data: {
        currency: 'gbp',
        unit_amount: item.price * 100,
        product_data: {
          name: `${item.title} Book`,
          description: item.description,

          images: [item.imageCover],
        },
      },
    };
  });
  // console.log(items);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `http://localhost:3000/books`,
    cancel_url: `http://localhost:3000/cart`,
    customer_email: req.user.email,
    mode: 'payment',

    client_reference_id: req.params.purchaseId,
    line_items: items,
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();
//   await Booking.create({ tour, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });

exports.getAllPurchases = factory.getAll(Purchase);
exports.getPurchase = factory.getOne(Purchase, { path: 'items' });
exports.createPurchase = factory.createOne(Purchase);
exports.updatePurchase = factory.updateOne(Purchase);
exports.deletePurchase = factory.deleteOne(Purchase);

exports.setTheBuyer = (req, res, next) => {
  req.body.buyer = req.user['_id'];
  console.log(req.user);
  next();
};
