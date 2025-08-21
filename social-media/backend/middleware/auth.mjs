import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const admin = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
