const Book = require('./../models/book');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
// const User = require('./../models/user');

exports.getAllBooks = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Book.find().populate('author'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const books = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books,
    },
  });
});

exports.getBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id)
    .populate('reviews')
    .populate('author');
  if (!book) {
    return next(new AppError('no Book matched this id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.createBook = catchAsync(async (req, res, next) => {
  const newBook = await Book.create({
    ...req.body,
  });

  res.status(201).json({
    status: 'success',
    data: {
      book: newBook,
    },
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!book) return next(new AppError('no Book matched this id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new AppError('no book matched this id', 404));

  await Book.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
