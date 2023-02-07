const mongoose = require('mongoose');
const validator = require('validator');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: [true, 'Please tell us your name!'],
    },
    photo: {
      type: String,
    },
    books: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Book',
    },
    age: {
      type: Number,
    },
    country: {
      type: String,
    },
    summary: {
      type: String,
      required: [true, 'an author must have a summary'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;
