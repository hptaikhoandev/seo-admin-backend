exports.checkRole = async (roles) => {
    return function(req, res, next) {
        if (req.user && roles.includes(req.user.roleId)) {
            next();
        } else {
            res.status(403).json({ error: 'Unauthorized.' });
        }
    };
}
