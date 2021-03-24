var express = require('express');
var router  = express.Router();
var connection = require('../models/model');
var mysql = require('mysql');

router.get('/ViewProfile/', function (req, res) {

    var ViewProfileSQL = 'SELECT email, phone_type, CONCAT (area_code, phone_number) AS phone, CONCAT (first_name, \' \', middle_name, \' \', last_name) AS full_name, ' +
        'CONCAT (street, \' \', city, \' \', state, \' \', zip_code, \' \' , zip_extension) AS address FROM Customer AS C1 NATURAL JOIN Phone WHERE CustomerID = ?';

    var secPhone = 'SELECT phone_type, CONCAT (area_code, phone_number) AS phone FROM Secondary NATURAL JOIN Phone Where CustomerID = ?';

    var ViewResSQL = 'SELECT reservationID, start_date, end_date, DATEDIFF(end_date, start_date) AS number_of_days, ' +
        'CONCAT(Clerk1.last_name, \' \',  Clerk1.middle_name, \' \', Clerk1.last_name ) ' +
        'AS drop_clerk,  CONCAT(Clerk2.last_name, \' \',  Clerk2.middle_name, \' \', Clerk2.last_name ) ' +
        'AS pick_clerk, SUM(original_price * 0.4) AS total_deposit,  ' +
        'SUM(DATEDIFF(end_date, start_date) * original_price * 0.15) AS total_rental ' +
        'FROM Reservation NATURAL JOIN AddRes NATURAL JOIN Tool LEFT OUTER JOIN Clerk AS ' +
        'Clerk1 ON Clerk1.ClerkID = Reservation.DropClerkID LEFT OUTER JOIN Clerk AS Clerk2 ON ' +
        'Clerk2.ClerkID = Reservation.PickClerkID WHERE Reservation.CustomerID = ? GROUP BY ' +
        'Reservation.reservationID ORDER BY start_date DESC';

    var toolSQL = 'SELECT reservationID, power_source, sub_option, sub_type FROM tool NATURAL JOIN AddRes NATURAL JOIN Reservation WHERE CustomerID = ?';

    var insert = [req.user.id];
    ViewProfileSQL = mysql.format(ViewProfileSQL, insert);
    connection.query(ViewProfileSQL, function(err, result1){
        if (err) {
            console.log(err);
        } else {
            secPhone = mysql.format(secPhone, insert);
            connection.query(secPhone, function (err, result2) {
                if (err) {
                    console.log(err);
                } else {
                    ViewResSQL = mysql.format(ViewResSQL, insert);
                    connection.query(ViewResSQL, function (err, result3) {
                        if (err) {
                            console.log(err);
                        } else {
                            for (var i = 0; i < result3.length; i++) {
                                result3[i].start_date =new Date(result3[i].start_date).toISOString().slice(0, 10);
                                result3[i].end_date =new Date(result3[i].end_date).toISOString().slice(0, 10);
                            }
                            toolSQL = mysql.format(toolSQL, insert);
                            connection.query(toolSQL, function (err, result4) {
                                for (var i = 0; i < result4.length; i++) {
                                    if (result4[i].power_source.toLowerCase() != 'manual') {
                                        result4[i].shortDes = result4[i].power_source + ' ' + result4[i].sub_option + ' ' + result4[i].sub_type;
                                    } else {
                                        result4[i].shortDes = result4[i].sub_option + ' ' + result4[i].sub_type;
                                    }
                                }
                                res.render('viewProfile', {result1 :result1, result2:result2, result3:result3, result4:result4});
                            });
                        }
                    });
                }
            });
        }
    });
});
router.get('/ViewProfile/:CustomerID', function (req, res) {


    var ViewProfileSQL = 'SELECT email, phone_type, CONCAT (area_code, phone_number) AS phone, CONCAT (first_name, \' \', middle_name, \' \', last_name) AS full_name, ' +
        'CONCAT (street, \' \', city, \' \', state, \' \', zip_code, \' \' , zip_extension) AS address FROM Customer AS C1 NATURAL JOIN Phone WHERE CustomerID = ?';

    var secPhone = 'SELECT phone_type, CONCAT (area_code, phone_number) AS phone FROM Secondary NATURAL JOIN Phone Where CustomerID = ?';

    var ViewResSQL = 'SELECT reservationID, start_date, end_date, DATEDIFF(end_date, start_date) AS number_of_days, ' +
        'CONCAT(Clerk1.last_name, \' \',  Clerk1.middle_name, \' \', Clerk1.last_name ) ' +
        'AS drop_clerk,  CONCAT(Clerk2.last_name, \' \',  Clerk2.middle_name, \' \', Clerk2.last_name ) ' +
        'AS pick_clerk, SUM(original_price * 0.4) AS total_deposit,  ' +
        'SUM(DATEDIFF(end_date, start_date) * original_price * 0.15) AS total_rental ' +
        'FROM Reservation NATURAL JOIN AddRes NATURAL JOIN Tool LEFT OUTER JOIN Clerk AS ' +
        'Clerk1 ON Clerk1.ClerkID = Reservation.DropClerkID LEFT OUTER JOIN Clerk AS Clerk2 ON ' +
        'Clerk2.ClerkID = Reservation.PickClerkID WHERE Reservation.CustomerID = ? GROUP BY ' +
        'Reservation.reservationID ORDER BY start_date DESC';

    var toolSQL = 'SELECT reservationID, power_source, sub_option, sub_type FROM tool NATURAL JOIN AddRes NATURAL JOIN Reservation WHERE CustomerID = ?';

    var insert = [req.params.CustomerID];
    console.log(insert);
    ViewProfileSQL = mysql.format(ViewProfileSQL, insert);
    connection.query(ViewProfileSQL, function(err, result1){
        if (err) {
            console.log(err);
        } else {
            console.log(result1)
            secPhone = mysql.format(secPhone, insert);
            connection.query(secPhone, function (err, result2) {
                if (err) {
                    console.log(err);
                } else {
                    ViewResSQL = mysql.format(ViewResSQL, insert);
                    connection.query(ViewResSQL, function (err, result3) {
                        if (err) {
                            console.log(err);
                        } else {
                            for (var i = 0; i < result3.length; i++) {
                                result3[i].start_date =new Date(result3[i].start_date).toISOString().slice(0, 10);
                                result3[i].end_date =new Date(result3[i].end_date).toISOString().slice(0, 10);
                            }
                            toolSQL = mysql.format(toolSQL, insert);
                            connection.query(toolSQL, function (err, result4) {
                                for (var i = 0; i < result4.length; i++) {
                                    if (result4[i].power_source.toLowerCase() != 'manual') {
                                        result4[i].shortDes = result4[i].power_source + ' ' + result4[i].sub_option + ' ' + result4[i].sub_type;
                                    } else {
                                        result4[i].shortDes = result4[i].sub_option + ' ' + result4[i].sub_type;
                                    }
                                }
                                res.render('viewProfile', {result1 :result1, result2:result2, result3:result3, result4:result4});
                            });
                        }
                    });
                }
            });
        }
    });
});
module.exports = router;