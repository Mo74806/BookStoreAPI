// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Book = require('./book');
const AppError = require('./../utils/appError');
const purchaseSchema = new mongoose.Schema(
  {
    items: {
      type: [mongoose.Schema.Types.ObjectID],
      ref: 'Book',
    },
    itemsQty: { type: [Number] },

    buyer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'purchase must belong to a user'],
    },
    delivery: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      // required: [true, 'purchase must belong to a user'],
    },
    status: {
      type: String,
      default: 'pending',
    },
    handOffline: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

purchaseSchema.pre('save', async function (next) {
  // this points to current review
  //handle the qty in stoke
  //1- if the wanted is less or equal the qty in stoke
  //2- reduce the qty in stoke
  //3-increase number of purchace by qty

  const items = this.items;
  let books = [];
  console.log(items);
  books = this.items.map(async (item) => {
    let res = Book.findOne({ _id: item });

    return res;
  });
  console.log('+++++++++++++++++++++++++++++++++++++++++++++');
  // console.log([...books]);
  books = await Promise.all(books);
  console.log();
  this.itemsQty.map((item, index) => {
    console.log(item);
    console.log(books[0].StokeQty);
    if (item <= books[index].StokeQty) {
      console.log(Date.now());
      console.log(`${books[index].StokeQty} ${books[index].numberOfSeller}`);
      books[index].StokeQty = parseInt(books[index].StokeQty) - parseInt(item);
      books[index].numberOfSeller =
        parseInt(books[index].numberOfSeller) + parseInt(item);
      console.log(`${books[index].StokeQty} ${books[index].numberOfSeller}`);
    } else {
      next(
        new AppError(
          'the selected books are more than the ones in the stoke ',
          400
        )
      );
    }
  });

  books.map(async (book) => {
    await Book.findOneAndUpdate(
      { _id: book['_id'] },
      { StokeQty: book.StokeQty, numberOfSeller: book.numberOfSeller }
    );
  });

  next();
});

// purchaseSchema.pre(/^findOneAnd/, async function (next) {
//   this.data = await this.findOne();
//   // console.log(this.r);
//   next();
// });

// purchaseSchema.post(/^findOneAnd/, async function () {
//   // await this.findOne(); does NOT work here, query has already executed
//   await this.r.constructor.calcAverageRatings(this.r.book);
// });

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
