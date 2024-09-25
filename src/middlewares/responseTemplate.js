module.exports = (req, res, next) => {
  res.success = (statusCode = 200, data, message = 'Success') => {
    res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  };

  res.error = (statusCode, error, message = 'Error') => {
    res.status(statusCode).json({
      status: 'error',
      message,
      error,
    });
  };

  next();
};
