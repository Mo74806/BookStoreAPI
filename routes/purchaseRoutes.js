const express = require('express');
const purchaseController = require('./../controllers/purchaseController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router
  .route('/createSession/:purchaseId')
  .get(purchaseController.getCheckoutSession);

router.route('/').get(purchaseController.getAllPurchases).post(
  // authController.restrictTo('user')
  purchaseController.setTheBuyer,
  purchaseController.createPurchase
);

router
  .route('/:id')
  .get(purchaseController.getPurchase)
  .patch(
    // authController.restrictTo('user', 'admin'),
    purchaseController.updatePurchase
  )
  .delete(
    // authController.restrictTo('user', 'admin'),
    purchaseController.deletePurchase
  );

module.exports = router;
