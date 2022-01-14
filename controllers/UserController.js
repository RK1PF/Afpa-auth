require('dotenv').config();
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// JWT
function generateAccesToken(user) {
    return jwt.sign(user, process.env.TOKEN, { expiresIn: '50m' })
};
exports.authenticateToken = (req, res, next) => {
    // const token = req.headers['x-access-token']
    console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1]
    console.log(`TOKEN = ${token}`);
    if (token == null) { return res.sendStatus(401) } // if there isn't any token
    jwt.verify(token, process.env.TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

// Admin Api
exports.getAdmin = async (req, res) => {
    const users = await User.find();
    try {
        res.send(users);
    } catch (e) {
        res.statusCode(500).send(e);
    }
};

exports.postAdmin = async (req, res) => {
    const username = req.params.adminUsername;
    const password = req.params.adminPassword;
    const name = req.body.name;

    const user = new User({
        name: name,
        email: username,
        password: password,
        active: true
    })

    user.save((err) => {
        if (!err) {
            console.log(`New user inserted: ${username}, ${name}`)
            res.render("home")
        } else {
            console.log(err)
        }
    })
}

exports.deleteAdmin = async (req, res) => {
    User.deleteOne({
        email: req.params.email
    }, (err) => {
        if (!err) {
            console.log(`User deleted: ${req.params.email}`)
            res.redirect("/")
        }
    })
}

// Register
exports.getRegister = async (req, res) => {
    res.render("register");
}
exports.postRegister = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    // Bcrypt
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt)
    User.findOne({
        email: username
    }, (err, user) => {
        if (!err) {
            if (user) {
                console.log(`${username} already registered here`);
                res.status(400).render("register");
            } else {
                const user = new User({
                    name: name,
                    email: username,
                    password: hash,
                    active: true
                });
                user.save((err) => {
                    if (!err) {
                        console.log(`New user inserted: ${username}, ${name}`)
                        res.render("secrets")
                    } else {
                        console.log(err)
                    }
                });
            }
        } else {
            console.log(err);
        }
    })

}

// Login
exports.getLogin = async (req, res) => {
    res.render("login");
}
exports.postLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({
        email: username
    }, (err, userFound) => {
        if (!err) {
            if (userFound) {
                const isValidPass = bcrypt.compareSync(password, userFound.password)
                // BCRYPT renvoies un Boolean
                if (isValidPass) {
                    const token = generateAccesToken({ user: userFound });
                    console.log(`${username} logged in\n Token:\n${token}`);
                    res.status(200).render("secrets");
                } else {
                    console.log(`Wrong password for: ${username}`);
                    res.render("home");
                }
            }
        } else {
            console.log(err);
        }
    })
}
