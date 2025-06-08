const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure it's a user token (not employee)
    if (decoded.type !== 'user') {
      return res.status(403).json({ message: 'Access denied - User access required' });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const employeeAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure it's an employee token
    if (decoded.type !== 'employee') {
      return res.status(403).json({ message: 'Access denied - Employee access required' });
    }
    
    req.employee = decoded;
    next();
  } catch (err) {
    console.error('Employee token verification error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { auth, employeeAuth };
