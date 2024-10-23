const User = require('../models/user');
const { jwtDecode } = require('jwt-decode');

exports.auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwtDecode(token);
    const user = await User.findOne(
      { 
        id: decoded.id, 
        name: decoded.name,
        roleId: decoded.roleId,
        'tokens.token': token,
      }
    );
    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Error massage:', error);
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

