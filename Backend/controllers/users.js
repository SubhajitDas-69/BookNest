const User = require("../models/user");

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            return res.status(201).json({
                success: true,
                message: "Welcome!",
                user: {
                    id: registeredUser._id,
                    username: registeredUser.username,
                    email: registeredUser.email,
                },
                redirectTo: "/"
            });
        });
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message,
            redirectTo: "/signup"
        });
    }
};

module.exports.login = async (req, res) => {
    try {
        const redirectUrl = res.locals.redirectUrl || "/";

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Login failed. User not authenticated.",
            });
        }
        res.status(200).json({
            success: true,
            message: "Welcome, you are logged in!",
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role,
            },
            redirectTo: req.user.role === "admin" ? "/profile" : redirectUrl,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong during login.",
            error: error.message,
        });
    }
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        res.status(200).json({
            success: true,
            message: "You are logged out",
        });
    });
};

module.exports.getCurrUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
}