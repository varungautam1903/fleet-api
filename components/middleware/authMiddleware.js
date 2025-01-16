const authUtils = require('../utils/authUtils');
const User = require('../../controllers/user/user.model');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = authUtils.decodeToken(token);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, Token is not valid' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
};

module.exports = { protect, admin };