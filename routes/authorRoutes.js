const express = require('express');
const authorController = require('./../controllers/authorController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authorController.getAllAuthors)

  .post(authorController.createAuthor);

router
  .route('/:id')
  .get(authorController.getAuthor)
  .patch(authorController.updateAuthor)
  .delete(authorController.deleteAuthor);

module.exports = router;
