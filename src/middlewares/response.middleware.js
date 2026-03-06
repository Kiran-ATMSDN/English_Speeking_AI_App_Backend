function responseFormatter(_req, res, next) {
  res.success = function success(message, data, status = 200) {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  };

  res.error = function errorResponse(message, status = 500, error = null) {
    const payload = {
      success: false,
      message,
    };

    if (error) {
      payload.error = error;
    }

    return res.status(status).json(payload);
  };

  next();
}

module.exports = { responseFormatter };
