const fs = require('fs');
const Tours = require('../models/tourModel');

//get Top 5 Tours

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields =
    'name,price,description,summary, difficulty, ratingsAverage';
  next();
};

// get All tours

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // EXECUTE QUERY
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tours.find(JSON.parse(queryStr));

    //SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      let numTours = await Tours.countDocuments();
      if (skip >= numTours) {
        throw new Error('This page does not exists');
      }
    }

    const tours = await query;

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch {
    res.status(404).json({ status: 'fail', message: 'Could not do the query' });
  }
};

//create new tour method 2 without database and reading from file

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tours.create(req.body);
    res.status(201).json({ status: 'success', data: { tours: newTour } });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

//get tours by id
exports.getTour = async (req, res) => {
  //automatically convert string to number
  try {
    const tours = await Tours.findById(req.params.id);
    res.status(200).json({ message: 'success', data: { tours } });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

//update Tour

exports.updateTour = async (req, res) => {
  try {
    const tours = await Tours.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: 'success',
      data: { tours },
    });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tours = await Tours.findByIdAndDelete(req.params.id);

    res.status(204).json({
      message: 'success',
      data: tours,
    });
  } catch (error) {
    res.status(404).json({ status: 'fail', message: error });
  }
};

///old codes

// checkId if it is valid

// exports.checkId = (req, res, next, val) => {
//   console.log(`This is the ${val}`);
//   // if (req.params.id * 1 > tours.length) {
//   //   return res.status(404).json({
//   //     status: 'fail',
//   //     message: 'invalid Id',
//   //   });
//   // }
//   next();
// };

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// create tours

//create new tour method 1 without database and reading from file
// exports.createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);
//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     () => res.status(201).json({ status: 'success', data: { tours: newTour } })
//   );
// };

// // get All tours

// exports.getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.timer,
//     result: tours.length,
//     data: { tours },
//   });
// };

// //get tours by id
// exports.getTour = (req, res) => {
//   //automatically convert string to number
//   const id = req.params.id * 1;
//   let tour = tours.find((item) => item.id === id);

//   res.status(200).json({ message: 'success', data: { tour } });
// };

// exports.deleteTour = (req, res) => {
//   res.status(204).json({
//     message: 'success',
//     data: null,
//   });
// };

// both methods to query
// const newTour = await Tours.find({
//   duration: 5,
//   difficulty: 'easy',
// });

// const newTour = await Tours.find()
//   .where('duration')
//   .equals(5)
//   .where('difficulty')
//   .equals('easy');

// exports.getAllTours = async (req, res) => {
//   try {
//     // BUILD QUERY
//     //1)Filtering
//     const queryObj = { ...req.query };
//     const excludeFields = ['page', 'sort', 'limit', 'fields'];
//     excludeFields.forEach((el) => delete queryObj[el]);

//     // console.log(req.query, queryObj);
//     // { difficulty: 'easy', duration: { gte: '5' }, sort: '1', limit: '10' }
//     //gte gt lte lt

//     //2)Advanced Filtering used for Chaining puprose

//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     let query = Tours.find(JSON.parse(queryStr));

//     // 3) Sorting
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(',').join(' ');
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort(--createdAt);
//     }

//     if (req.query.fields) {
//       console.log('keda ami');
//     } else {
//       console.log('nothing');
//     }

//     // 3.2) FILTERING

//     // EXECUTE QUERY
//     let tours = await query;

//     //SEND RESPONSE
//     res.status(200).json({
//       status: 'success',
//       results: tours.length,
//       data: { tours },
//     });
//   } catch {
//     res.status(404).json({ status: 'fail', message: 'Could not do the query' });
//   }
// };
