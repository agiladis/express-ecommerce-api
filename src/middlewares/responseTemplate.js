module.exports = (req, res, next) => {
  res.success = (
    statusCode = 200,
    data,
    message = 'Success',
    pagination = null
  ) => {
    const response = {
      status: 'success',
      message,
      data,
    };

    if (pagination) {
      response.pagination = pagination;
    }

    res.status(statusCode).json(response);
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
