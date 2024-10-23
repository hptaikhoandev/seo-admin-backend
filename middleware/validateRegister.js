const User = require('../models/user');
const { validateRegister } = require('../utils/validation');

exports.validateRegister = async (req, res, next) => {
    const { name, email, password } = req.body;
    const { error } = validateRegister({ name, email, password });

    if (error) {
      return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }
    next();
  };