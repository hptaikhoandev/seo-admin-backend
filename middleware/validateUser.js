const User = require('../models/user');

exports.validateUser = async (req, res, next) => {
    const { email, password } = req.body;
    if ( !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    next();
  };