const app = require('./app');
require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB, () => {
  console.log('connected');
});

const TourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour must have a name'],
  },
  rating: { type: Number, default: 5 },
  price: { type: Number, required: [true, 'A Tour must have a price'] },
});

const Tours = mongoose.model('tours', TourSchema);

const port = app.listen(3000, () => {
  console.log(`App running on port ...`);
});

// db.tours.insertMany([
// { name: "sea explorer", price: "99", rating: 4.2, difficulty: "easy" },
// { name: "snow adventurer", price: "50", rating: 4.7, difficulty: "hard" },
// ]);

// lessthan

// db.tours.find({ price: { $lte: 500 }, rating: {$gte:4.8}});

// incase you want to show the name only
// db.tours.find({ price: { $lte: 500 }, rating: {$gte:4.8}},{name:1});

// ---------------update Document--------------

// db.tours.updateOne({ name: 'forest hiker' }, { $set: { price: 420 } });

// =============deletedocument==================

// db.tours.deleteMany({ rating: { $lte: 4.8 } });

// db.tours.deleteMany({});
