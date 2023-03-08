const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
});

reviewSchema.statics.calcAverageRatings = async function (tourID) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourID },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRatings: { $avg: '$rating' },
      },
    },
  ]);

  reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

  if (!stats) {
    await Tour.findByIdAndUpdate(tourID, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  } else {
    await Tour.findByIdAndUpdate(tourID, {
      ratingsAverage: stats[0].avgRatings,
      ratingsQuantity: stats[0].nRatings,
    });
  }
};

reviewSchema.post('save', (doc) =>
  doc.constructor.calcAverageRatings(doc.tour)
);

reviewSchema.post(
  /^findOneAnd/,
  async (doc) => await doc.constructor.calcAverageRatings(doc.tour)
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
