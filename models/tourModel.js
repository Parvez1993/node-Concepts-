const mongoose = require('mongoose');

const TourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour must have a name'],
    },
    duration: {
      type: Number,
      required: [true, 'A Tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A Tour must have a Group Size'],
    },
    rating: { type: Number, default: 5 },
    ratingsAverage: { type: Number, default: 4.7 },
    price: { type: Number, required: [true, 'A Tour must have a price'] },
    difficulty: {
      type: String,
      required: [true, 'A Tour must have a difficulty'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A Tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A Tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A Tour must have a image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
const Tours = mongoose.model('tours', TourSchema);

module.exports = Tours;
