const fs = require('fs');

// checkId if it is valid

exports.checkId = (req, res, next, val) => {
  console.log(`This is the ${val}`);
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'invalid Id',
  //   });
  // }
  next();
};

// get All tours

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.timer,
    result: tours.length,
    data: { tours },
  });
};

//create new tour
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => res.status(201).json({ status: 'success', data: { tours: newTour } })
  );
};
//get tours by id
exports.getTour = (req, res) => {
  //automatically convert string to number
  const id = req.params.id * 1;
  let tour = tours.find((item) => item.id === id);

  res.status(200).json({ message: 'success', data: { tour } });
};

//update Tour

exports.updateTour = (req, res) => {
  res.status(200).json({
    message: 'success',
    data: { tour: '<updated tour here............>' },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    message: 'success',
    data: null,
  });
};
