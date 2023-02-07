const mongoose = require('mongoose');
const validator = require('validator');
const Author = require('./author');

//book schema
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A book must have a title'],
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'Author',

      // required: [true, 'A book must have an author'],
    },
    fullDescription: {
      type: String,
    },
    description: {
      type: String,
    },
    imageCover: {
      type: String,
    },
    category: {
      type: [String],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    numberOfSeller: {
      type: Number,
      default: 0,
    },
    StokeQty: {
      type: Number,
      default: 1,
    },
    imageCover: {
      type: String,
      required: [true, 'A book must have an image'],
    },
    qty: {
      type: Number,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

bookSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'book',
  localField: '_id',
});

bookSchema.pre('save', async function (next) {
  console.log(this.author);
  const author = await Author.findByIdAndUpdate(this.author, {
    $push: { books: this.id },
  });
  // console.log(author);
  next();
});

bookSchema.pre('findByIdAndDelete', async function (next) {
  console.log(this.author);
  const author = await Author.findById(this.author);
  if (author) {
    let books = author.books;
    books.filter((book) => book.id != this.id);
    await Author.findById(this.author, { books });
  }
  next();
});

//create User Model
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
