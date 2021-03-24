var express = require('express');
var router  = express.Router();
var connection = require('../models/model');
var middleware = require('../middleware/index');


router.get('/clerkReport', function (req, res) {
    var pickSQL = 'SELECT ClerkID, first_name, middle_name, last_name, email, hire_date, ' +
        'COUNT(ClerkID) AS number_of_pickups, PickClerkID FROM Clerk LEFT OUTER JOIN Reservation ' +
        'ON Reservation.PickClerkID =Clerk.ClerkID WHERE MONTH(start_date) = MONTH(CURDATE()) GROUP BY Clerk.ClerkID';

    var dropSQL = 'SELECT ClerkID, COUNT(ClerkID) AS number_of_dropoffs FROM Clerk JOIN Reservation ON Reservation.DropClerkID =Clerk.ClerkID WHERE MONTH(end_date) = MONTH(CURDATE()) GROUP BY Clerk.ClerkID';
    connection.query(pickSQL, function(err, result1){
        if (err) {
            console.log(err);
        } else {
            console.log(result1);
            connection.query(dropSQL, function (err, result2) {
                if (err) {
                    console.log(err);
                } else {
                    for (var i = 0; i < result1; i++) {
                        if (!result1[i].PickClerkID) {
                            result1[i].number_of_pickups = 0;
                        }
                        for (var j = 0; j < result2; j++) {
                            if (result1[i].ClerkID === result2[j].ClerkID) {
                                result1[i].number_of_dropoffs = result2[j].number_of_dropoffs;
                            }
                        }
                        result1[i].total = result1[i].number_of_pickups + result1[i].number_of_dropoffs;
                    }
                }
                res.render('clerkReport', {result : result1});
            });

        }
    });
});
router.get("/customerReport",function (req,res) {

    var q = 'SELECT Customer.CustomerID, first_name, middle_name, last_name, email, CONCAT(area_code, \'-\', phone_number, \'-\', extension) AS Phone, COUNT(Reservation.reservationID) AS total_reservation,  COUNT(AddRes.ToolID) AS total_tools_rented FROM  Customer NATURAL JOIN Phone LEFT OUTER JOIN Reservation ON Customer.CustomerID = Reservation.CustomerID LEFT OUTER JOIN AddRes ON  Reservation.reservationID = AddRes.reservationID WHERE (MONTH(start_date) = (MONTH(CURDATE()) - 1) AND YEAR(start_date) = YEAR(CURDATE())) OR (MONTH(start_date)= 12 AND MONTH(CURDATE()) = 1 AND YEAR(start_date)=(YEAR(CURDATE()) - 1))  GROUP BY Customer.CustomerID;'
    connection.query(q,function (err,results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results)
        }
        res.render("customerReport",{results:results});

    });

});


router.get('/toolReport', middleware.isClerkLoggedIn, function (req, res) {
    var q = 'SELECT Tool.ToolID, sum(DATEDIFF(end_date, start_date)) AS rentaldays, max(end_date) AS end_date, CURDATE() AS now, original_price, power_source, sub_option, sub_type FROM Tool NATURAL LEFT OUTER JOIN (Addres NATURAL JOIN Reservation) GROUP BY ToolID, original_price';
    connection.query(q, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            var tool = [];

            for (var i = 0; i < results.length; i++) {
                //get ToolID
                var tuple = {};
                tuple.toolid = results[i].ToolID;
                //get current status and date
                if (results[i].end_date && results[i].end_date >= results[i].now) {
                    tuple.status = 'rented';
                    tuple.date = results[i].end_date;

                } else {
                    tuple.date = '';
                    tuple.status = 'available';
                }
                //get short description
                if (results[i].power_source.toLowerCase() != 'manual') {
                    tuple.shortDes = results[i].power_source + ' ' + results[i].sub_option + ' ' + results[i].sub_type;
                } else {
                    tuple.shortDes = results[i].sub_option + ' ' + results[i].sub_type;
                }
                //rental price
                tuple.rental = results[i].original_price * 0.15 * results[i].rentaldays;
                //cost
                tuple.cost = results[i].original_price;
                //profit
                tuple.profit = tuple.rental - tuple.cost;
                tuple.subType = results[i].sub_type;
                //add a tuple
                tool.push(tuple);
            }


            res.render("toolReport", {tool: tool});
        }
    });
});

module.exports = router;