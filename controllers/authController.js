const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require("../models/user");

// Định nghĩa secret key cho JWT
const JWT_SECRET = crypto.randomBytes(64).toString('hex');

exports.Register = async (req, res) => {

    const { name, email, password } = req.body;
    
    try {
        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const user = await User.create({ name, email, password: hashedPassword, roleId: "2" });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.Login = async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra xem email và password có được cung cấp không
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Kiểm tra xem người dùng có tồn tại hay không
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Tạo token JWT
        const tokenData = {
            id: user.id,
            name: user.name,
            roleId: user.roleId,
          };
        const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: '12h' });


        // Trả về thông tin người dùng và token
        return res.header('Authorization', `Bearer ${token}`).json({
            code: 1,
            status: 'Success',
            message: 'Login successful',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                roleId: user.roleId,
                token
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.Logout = async (req, res) => {
    try {
        // Assuming req.user and req.token are attached through middleware
        req.user.tokens = req.user.tokens.filter((tokenObj) => tokenObj.token !== req.token);
        // Save the user with the updated tokens array
        await req.user.save();
        res.json({ message: 'Logout successful' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};
