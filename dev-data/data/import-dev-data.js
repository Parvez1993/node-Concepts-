const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const Tours = require('../../models/tourModel');

const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB, () => {
  console.log('connected');
});

//Reading JSON FILE

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//Import data into Db

const importData = async () => {
  try {
    await Tours.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//delete all database

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tours.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// get the 3rd in process.argv

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
