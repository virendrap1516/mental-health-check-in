const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate entry',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;