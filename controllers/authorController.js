const Author = require('./../models/author');
const factory = require('./handlerFactory');
// const catchAsync = require('./../utils/catchAsync');

exports.getAllAuthors = factory.getAll(Author);
exports.getAuthor = factory.getOne(Author, { path: 'books' });
exports.createAuthor = factory.createOne(Author);
exports.updateAuthor = factory.updateOne(Author);
exports.deleteAuthor = factory.deleteOne(Author);
