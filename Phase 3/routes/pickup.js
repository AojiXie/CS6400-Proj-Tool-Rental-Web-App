var express = require('express');
var router  = express.Router();
var connection = require('../models/model');
var mysql = require ('mysql');


//VIEW reservations
router.get('/Pickup', function (req, res) {

    var ViewResSQL = 'SELECT reservation.reservationID, start_date, end_date, Customer.CustomerID, ' +
        'username, CONCAT(first_name, last_name) AS customer_name, DATEDIFF(end_date, start_date) ' +
        'as number_of_days, SUM(original_price * 0.4) AS total_deposit, ' +
        'SUM( DATEDIFF(end_date, start_date) * original_price * 0.15) ' +
        'AS total_rental FROM Reservation NATURAL JOIN Customer NATURAL JOIN AddRes NATURAL JOIN Tool ' +
        'WHERE PickClerkID IS NULL GROUP BY reservationID ORDER BY reservationID;';
    connection.query(ViewResSQL,function (error,results) {
        if (error) {console.log(error)}
        else {
            res.render ("pickup",{results:results})
        }

    })



});

router.get('/pickupConfirmation',function (req,res) {
    res.render ('pickupConfirmation')

});
router.post('/rentalContract',function (req,res) {
    var new_card = req.body.card;
    var reservationID = req.body.reservation_id;
    var name_on_card = req.body.name_on_card;
    var card_number = req.body.card_number;
    var month = req.body.month;
    var year = req.body.year;
    var cvc_3_digit = req.body.cvc_3_digit_number;
    var pickupClerk = 1;

    var q1 = 'UPDATE Reservation SET PickClerkID = ? WHERE reservationID = ?';
    var insert1 = [pickupClerk, reservationID];
    q1 = mysql.format(q1, insert1);


    connection.query(q1,function (error,results) {
        if (error){console.log(error)}
        else{
            console.log(results)
        }

    });

    if (new_card === 'new'){

        var q2 = 'SELECT CustomerID FROM Reservation WHERE reservation = ?';
        var insert2 = [reservationID];
        q2 = mysql.format(q2,insert2);
        connection.query(q2,function (error,results) {
            if (error){console.log(error)}
            else{
                console.log(results);
                var customer_id = results.CustomerID;
                var q3 = 'UPDATE Customer SET card_number = ?, name_on_card = ?, month = ?, year = ?, cvc_3_digit_number = ?, WHERE CustomerID = ?';
                var insert3 = [card_number,name_on_card,month,year,cvc_3_digit,customer_id];
                q3 = mysql.format(q3,insert3);
                connection.query(q3,function (error,results) {
                    if (error){console.log(error)}
                    else {console.log(results)}
                })
            }
        })

    }
    var ContractSQL = 'SELECT CONCAT(Clerk.first_name, Clerk.last_name) AS pick_up_clerk_name, ' +
        'CONCAT (Customer.first_name, Customer.last_name) AS customer_name, card_number, ' +
        'start_date, end_date, ToolID, power_source, sub_option, sub_type, ' +
        '(0.15*original_price* DATEDIFF(end_date,start_date)) AS rental_price, (0.4*original_price) AS ' +
        'deposit_price FROM Reservation NATURAL JOIN AddRes NATURAL JOIN Tool NATURAL JOIN ' +
        'Customer INNER JOIN Clerk ON reservation.PickClerkID = Clerk.ClerkID WHERE reservationID = ?';
    var insert3 = [reservationID];
    ContractSQL = mysql.format(ContractSQL,insert3);
    connection.query(ContractSQL,function (error,results) {
        if (error){console.log(error)}
        else {
            for (var i = 0; i < results.length; i++) {
                if (results[i].power_source.toLowerCase() != 'manual') {
                    results[i].shortDes = results[i].power_source + ' ' + results[i].sub_option + ' ' + results[i].sub_type;
                } else {
                    results[i].shortDes = results[i].sub_option + ' ' + results[i].sub_type;
                }
            }

            res.render("rentalContract",{results:results})
        }

    });




});
//router.post('/pickupConfirmation',function (req,res) {
  //  var id = req.body.reservation_id;


//});

//UPDATE Pickup clerk
/*router.post('/Pickup', function (req, res) {
    var PickupClerkSQL = "UPDATE Reservation SET PickClerkID = ClerkID WHERE reservationID = reservationID";
    connection.query(PickupClerkSQL, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
    });

    var ViewResSQL = 'SELECT reservation.reservationID, start_date, end_date, Customer.CustomerID, ' +
        'username, CONCAT(first_name, last_name) AS customer_name, DATEDIFF(end_date, start_date) ' +
        'as number_of_days, SUM(original_price * 0.4) AS total_deposit, ' +
        'SUM( DATEDIFF(end_date, start_date) * original_price * 0.15) ' +
        'AS total_rental FROM Reservation NATURAL JOIN Customer NATURAL JOIN AddRes NATURAL JOIN Tool ' +
        'WHERE PickClerkID IS NULL GROUP BY reservationID ORDER BY reservationID;';
    var ContractSQL = 'SELECT CONCAT(Clerk.first_name, Clerk.last_name) AS pick_up_clerk_name, ' +
        'CONCAT (Customer.first_name, Customer.last_name) AS customer_name, card_number, ' +
        'start_date, end_date, ToolID, power_source, sub_option, sub_type, ' +
        '(0.15*original_price* DATEDIFF(end_date,start_date)) AS rental_price, (0.4*original_price) AS ' +
        'deposit_price FROM Reservation NATURAL JOIN AddRes NATURAL JOIN Tool NATURAL JOIN ' +
        'Customer INNER JOIN Clerk ON reservation.PickClerkID = Clerk.ClerkID WHERE reservationID = reservationID';
    connection.query(ViewResSQL, reservationID, function (err, result1) {
        connection.query(ContractSQL, function (err, result2) {
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
            }
            console.log('Data retrieved!\n');
            res.render( 'ViewProfile', {  result1: result1, result2:result2});
        });
    });
}); */

/*var results = [{reservationID:0,username:"XX",customer_name:"SD",CustomerID:"12",start_date:"222",end_date:"222",total_deposit:"DD",total_rental:"DDD"},
        {reservationID:1,username:"XX",customer_name:"SD",CustomerID:"12",start_date:"222",end_date:"222",total_deposit:"DD",total_rental:"DDD"},
        {reservationID:2,username:"XX",customer_name:"SD",CustomerID:"12",start_date:"222",end_date:"222",total_deposit:"DD",total_rental:"DDD"}];
    res.render("pickup",{results:results}) */

module.exports = router;