var express = require('express');
var router  = express.Router();
var connection = require('../models/model');
var mysql = require('mysql');

router.get("/dropoff", function (req, res) {
    var dropSQL = "SELECT reservation.reservationID, start_date, end_date, Customer.CustomerID, " +
        "username, CONCAT(first_name, last_name) AS customer_name, DATEDIFF(end_date, start_date) as " +
        "number_of_days, SUM(original_price * 0.4) AS total_deposit, " +
        "SUM( DATEDIFF(end_date, start_date) * original_price * 0.15) AS total_rental FROM Reservation " +
        "NATURAL JOIN Customer NATURAL JOIN AddRes NATURAL JOIN Tool WHERE PickClerkID IS NOT NULL " +
        "AND DropClerkID IS NULL GROUP BY reservation.reservationID ORDER BY reservation.reservationID";
    connection.query(dropSQL, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            res.render("dropoff", {results : results});
        }
    });

});
router.post("/dropConfirm",function (req,res) {
    var reservationID = req.body.reservationID
    var q = 'SELECT reservationID, ToolID, (0.15 * original_price*DATEDIFF(end_date, start_date)) AS rental_price, (0.4*original_price) AS deposit_price,CONCAT(first_name, last_name) AS customer_name, power_source, sub_option, sub_type FROM Reservation NATURAL JOIN AddRes NATURAL JOIN Tool NATURAL JOIN Customer WHERE reservationID = ?';
    var insert = [reservationID]
    q = mysql.format(q,insert);
    connection.query(q,function (error,results) {
        if (error) {
            console.log(error)
        }else{
            for (var i = 0; i < results.length; i++) {
                if (results[i].power_source.toLowerCase() != 'manual') {
                    results[i].shortDes = results[i].power_source + ' ' + results[i].sub_option + ' ' + results[i].sub_type;
                } else {
                    results[i].shortDes = results[i].sub_option + ' ' + results[i].sub_type;
                }
            }
            res.render("dropConfirm",{results:results})
        }

    })


});
router.post('/dropoffDetails',function (req,res) {
    var reservationID = req.body.reservationID;
    var dropClerk = 1;
    var q = 'UPDATE Reservation SET DropClerkID = ? WHERE reservationID = ?';
    var inserts = [dropClerk, reservationID];
    q = mysql.format(q, inserts);
    connection.query(q, function (error, results) {
        if (error) {
            console.log(error)
        }
        else {
            console.log(results)
        }


    });


    var q1 = 'SELECT CONCAT(Clerk.first_name, Clerk.last_name) AS drop_off_clerk_name, ' +
        'CONCAT (Customer.first_name, Customer.last_name) AS customer_name, card_number, ' +
        'start_date, end_date, ToolID, power_source, sub_option, sub_type, ' +
        '(0.15*original_price* DATEDIFF(end_date,start_date)) AS rental_price, (0.4*original_price) AS ' +
        'deposit_price FROM Reservation NATURAL JOIN AddRes NATURAL JOIN Tool NATURAL JOIN ' +
        'Customer INNER JOIN Clerk ON Reservation.DropClerkID = Clerk.ClerkID WHERE ClerkID = ? AND Reservation.reservationID = ?';
    var insert1 = [dropClerk, reservationID];
    q1 = mysql.format(q1, insert1);
    connection.query(q1, function (error, results1) {
        if (error) {
            console.log(error)
        } else {
            for (var i = 0; i < results1.length; i++) {
                if (results1[i].power_source.toLowerCase() != 'manual') {
                    results1[i].shortDes = results1[i].power_source + ' ' + results1[i].sub_option + ' ' + results1[i].sub_type;
                } else {
                    results1[i].shortDes = results1[i].sub_option + ' ' + results1[i].sub_type;
                }
            }

            console.log(results1);
            res.render("dropoffDetails", {results: results1});

        }
    });
});


module.exports = router;