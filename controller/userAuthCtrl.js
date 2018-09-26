var userModel = require('../models/userModel')
var jwt = require('jsonwebtoken')
module.exports.signup = (req, res) => {
    let body = req.body;
    let name = body.name;
    let username = body.username;
    let email = body.email;
    let password = userModel.getHash(body.password)
    let gender = body.gender;
    let phone = body.phone;
    let user1 = new userModel({
        name: name,
        username: username,
        email: email,
        password: password,
        gender: gender,
        phone: phone
    })
    user1.save(function (err, doc) {
        if (err) {
            console.log(err)
            res.send(err)
        }
        res.redirect('/users/login')
    })

}

module.exports.logout = (req, res) => {
    req.logout();
    var token = req.cookies.AuthCookie;
    console.log(token)
    res.clearCookie('AuthCookie')
    res.render('index', {
        "lgMsg": "Successfully Logout..."
    })
}

module.exports.signin = (req, res) => {
    let body = req.body;
    let username = body.username;
    let password = body.password;

    userModel.findOne({
        username: username
    }, (err, doc) => {
        if (err) {
            res.send('Invalid User Name...<a href="/users/login">Relogin</a>')
        }
        console.log("Document is:")
        console.log(doc)
        if (!doc) {
            res.send('Invalid User Name and Password<a href="/users/login">Relogin</a>')
            return;
        }
        if (doc.length != 0) {
            let valid = userModel.comparePassword(password, doc.password);
            if (valid) {
                let token = jwt.sign({
                    name: doc.name,
                    username: doc.username,
                    password: doc.password,
                    email: doc.email
                }, "systango@#$secret123", {
                    expiresIn: '1h'
                }, {
                    algorithm: 'HS512'
                })
                res.cookie('AuthCookie', token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true
                });
                console.log(token)
                res.redirect('/users/profile')
            } else {
                res.send('Invalid Password...<a href="/users/login">Relogin</a>')
            }
        } else {
            res.sendStatus(403);
        }
    })
}