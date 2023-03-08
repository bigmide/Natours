const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDocument = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { data: newDocument },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourID) filter = { tour: req.params.tourID };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filtering()
      .sorting()
      .limitFields()
      .paginate();
    const document = await features.query;
    res.status(200).json({
      status: 'success',
      results: document.length,
      data: { data: document },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const document = await query;
    if (!document)
      return next(new AppError('No document found with that ID', 404));
    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document)
      return next(new AppError('No document Found with that ID', 404));
    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document)
      return next(new AppError('No Document Found with that ID', 404));
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
