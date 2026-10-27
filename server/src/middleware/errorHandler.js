function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: `API route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const status = Number(error.status || error.statusCode) || 500;
  const message = status >= 500 && process.env.NODE_ENV === "production"
    ? "Internal server error"
    : error.message || "Internal server error";

  if (status >= 500) console.error(error);
  res.status(status).json({ success: false, message });
}

module.exports = { notFoundHandler, errorHandler };
