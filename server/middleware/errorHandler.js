/**
 * Global Express error handler
 * Catches errors passed via next(err) from any route
 * Must have 4 parameters for Express to recognize it as an error handler
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ScholarHub Error] ${err.message}`);

  // Mongoose validation errors — return readable field messages
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join('. ') });
  }

  // Mongoose bad ObjectId (e.g. /api/students/not-a-valid-id)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid student ID format.' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong on the server.',
  });
};

module.exports = errorHandler;
