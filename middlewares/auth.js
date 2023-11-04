import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
  const token = req.header('x-auth-token'); // Assuming the token is passed in the 'x-auth-token' header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}

// Example usage in a route
app.get('/protected-route', authenticateToken, (req, res) => {
  // This route is protected and can only be accessed with a valid JWT token.
  res.json({ message: 'Protected route accessed successfully.' });
});
