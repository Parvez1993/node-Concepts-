const fs = require('fs');
const Tours = require('../models/tourModel');

//get Top 5 Tours

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// get All tours

//function to organize code

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tours.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

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

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tours.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        //for ascending
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; // 2021

    //get individual files
    const plan = await Tours.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
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
