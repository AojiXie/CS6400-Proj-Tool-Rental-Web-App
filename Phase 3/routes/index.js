
var express = require('express');
var passport = require('passport');
var router  = express.Router();
var connection = require('../models/model');


var middleware = require('../middleware/index');


router.get('/', function(req, res){
    res.send('There will be a landing page!');
});

router.get('/customermenu', middleware.isCustomerLoggedIn, function (req, res) {
    res.render("customermenu");
});

router.get('/clerkmenu', middleware.isClerkLoggedIn, function (req, res) {
    res.render("clerkmenu");
});

router.get('/login', function (req, res) {
    res.render("loginin");
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            if (info.message === 'new') {
                return res.redirect('/register');
            } else {
                return res.redirect('/login');
            }
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            if (req.body.userType === 'customer') {
                return res.redirect('/customermenu');
            } else {
                return res.redirect('/clerkmenu')
            }
        });
    })(req, res, next);
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
});

router.get('/register', function (req, res) {
    res.render("register");
});

router.post('/register', function(req, res) {
    var user = {
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        password: req.body.password,
        username: req.body.username,
        email: req.body.email,
        city: req.body.city,
        street: req.body.street,
        state: req.body.state,
        name_on_card: req.body.name_on_card,
        card_number: req.body.card_number,
        month: req.body.month,
        year: req.body.year,
        cvc_3_digit_number: req.body.cvc_3_digit_number
    };
    var phone = {
        "home": req.body.home_phone,
        "work": req.body.work_phone,
        "cell": req.body.cell_phone
    };
    // parse the input 9 digit zipcode to code and extension. zip extension is optional
    var zip_number = req.body.zip_code.split('-');
    if (zip_number.last_name =1) {
        user.zip_code = zip_number[0];
    } else {
        user.zip_code = zip_number[0];
        user.zip_extension = zip_number[1];
    }
    // parse the phone number
    var phone_list = {};
    for (var phone_type in phone) {
        if (phone[phone_type] !== ""){
            var phone_number = phone[phone_type].split(/[-x]/);
            if (phone_number.length === 3) {
                phone_list[phone_type] = {
                    "phone_type": phone_type,
                    "area_code": phone_number[0],
                    "phone_number": phone_number[1],
                    "extension": phone_number[2]
                }
            } else {
                phone_list[phone_type] = {
                    "phone_type": phone_type,
                    "area_code": phone_number[0],
                    "phone_number": phone_number[1]
                }
            }
        }
    }
    //check the existence of username
    var existed = "SELECT username FROM customer WHERE username = ?";
    var inputUser = req.body.username;
    connection.query(existed, inputUser, function(err,result){
        if (err) {
            console.log(err);
        }else if (result.length !== 0) {
            console.log("Username" + result + "already existed");
            res.redirect('/register');
        } else {
            var phoneInsert = "INSERT INTO phone SET ?";
            connection.query(phoneInsert, phone_list[req.body.primary], function (err, result) {
                if (err) {
                    console.error("SQL connection error", err);
                    return next.err;
                }
                user.PhoneID = result.insertId;
                console.log("Primary PhoneID: ", user.PhoneID);
                var customerInsert = "INSERT INTO customer SET ?";
                connection.query(customerInsert, user, function(err, result) {
                    if (err) {
                        console.error("SQL connection error", err);
                        return next.err;
                    }

                    var customerID = result.insertId;
                    for (var type in phone_list) {
                        if (type !== req.body.primary) {
                            connection.query(phoneInsert, phone_list[type], function (err, result) {
                                if (err) {
                                    console.error("SQL connection error", err);
                                    return next.err;
                                }
                                var secondaryID = result.insertId;
                                var secondaryInsert = "INSERT INTO secondary SET ?";
                                connection.query (secondaryInsert, {"CustomerID": customerID, "PhoneID": secondaryID}, function (err,result){
                                    if (err) {
                                        console.error("SQL connection error", err);
                                        return next.err;
                                    }
                                });
                            });
                        }
                    }
                });
            });
            // redirect to login
            res.redirect("/login");
        }
    });
});

module.exports = router;