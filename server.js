const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB, () => {
  console.log('connected');
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

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
