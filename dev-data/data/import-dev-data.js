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
  } catch (error) {
    console.tour(error);
  }
};

//delete all database

const deleteData = async () => {
  try {
    await Tours.deleteMany();
    console.log('data successfully deleted');
  } catch (error) {
    console.tour(error);
  }
};

// get the 3rd in process.argv

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
