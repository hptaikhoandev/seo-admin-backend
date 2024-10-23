const User = require('../models/user');
const { validateLogin } = require('../utils/validation');

exports.validateLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const { error } = validateLogin({ email, password });
    if (error) {
      return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }
    next();
  };