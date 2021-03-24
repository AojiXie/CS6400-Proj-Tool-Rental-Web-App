var express = require('express');
var router =express.Router();
var connection = require('../models/model');
var mysql = require('mysql');



router.get("/makeReservation", function (req,res) {
    var results = [{Tool_id:"",shortDes:"",rental_price:"",deposit_price:""}];


    res.render('makeReservation',{results:results});

});
router.post("/makeReservation",function (req,res) {
    console.log(req.body);

    var start_date = new Date(req.body.start_date);
    var end_date = new Date(req.body.end_date);
    var key_word = req.body.custom_search;
    var type = req.body.tool_type;
    var sub_type = req.body.sub_type;
    var power_source = req.body.power_source;
    var q;
    var inserts;


       // not click any radio button and type in any input field
       if (typeof type ==='undefined' ){
           // search by key word
           if (key_word.length !== 0){

        q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE sub_option LIKE ? AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
        inserts = ["%" + req.body.custom_search + "%", start_date, end_date, end_date, start_date];}
           else {
               // search all without input
               q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
               inserts = [start_date, end_date, end_date, start_date]
           }


       }

       // clicked the radio button
        else {

         // 1 choose the specific tool type  and no key word
           if (key_word.length === 0 && type.length !== 0) {

               //not choose power source
             if (power_source.length === 0){
                 if (sub_type.length === 0){
                     // not choose sub_type
                     q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE type = ?  AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                     inserts = [req.body.tool_type,  start_date, end_date, end_date, start_date];


                 }else {  // choose sub_type
                     q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE type = ?  AND sub_type = ? AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                     inserts = [req.body.tool_type,  req.body.sub_type, start_date, end_date, end_date, start_date];


                 }


             }

             // click  type button
             else {
                 // not choose sub_type
                 if (sub_type.length === 0){
                     q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE type = ? AND power_source = ?  AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                     inserts = [req.body.tool_type, req.body.power_source, start_date, end_date, end_date, start_date];


                 // choose sub_type
                 }else{
                     q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE type = ? AND power_source = ? AND sub_type = ? AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                     inserts = [req.body.tool_type, req.body.power_source, req.body.sub_type, start_date, end_date, end_date, start_date];



                 }

             }


           }
           // 2 choose specific  type and  with key word

           else if (type.length !== 0 && key_word.length !== 0) {



               if (power_source.length === 0){  // not choose the power source
                   if (sub_type.length === 0){
                       q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE type = ? AND sub_option LIKE ? AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                       inserts = [req.body.tool_type, "%" + key_word + "%", start_date, end_date, end_date, start_date];


                   }else{  // choose the sub_type
                       q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE type = ?  AND sub_type = ? AND sub_option LIKE ? AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                       inserts = [req.body.tool_type,  req.body.sub_type, "%" + key_word + "%", start_date, end_date, end_date, start_date];


                   }
               }

               else{  // choose the power_source
                   if (sub_type.length === 0){
                       q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE type = ? AND power_source = ? AND sub_option LIKE ? AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                       inserts = [req.body.tool_type, req.body.power_source, "%" + key_word + "%", start_date, end_date, end_date, start_date];


                   }else{

                       q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE type = ? AND power_source = ? AND sub_type = ? AND sub_option LIKE ? AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                       inserts = [req.body.tool_type, req.body.power_source, req.body.sub_type, "%" + key_word + "%", start_date, end_date, end_date, start_date];


                   }

               }


            // 3 choose all tool and without  keyword
           } else if (type.length === 0 && key_word.length === 0) {
               // not choose power_source
               if (power_source.length === 0){
                   // not choose sub_type
                   if (sub_type.length === 0 ){
                       q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                       inserts = [ start_date, end_date, end_date, start_date];



                   }else{ // choose subtype
                       q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE sub_type = ? AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                       inserts = [ req.body.sub_type, start_date, end_date, end_date, start_date];


                   }

               }else // choose power_source
                   {
                       if (sub_type.length === 0){  // not choose sub_type
                           q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE power_source = ? AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                           inserts = [req.body.power_source,start_date, end_date, end_date, start_date];


                       }else{  // choose sub_type
                           q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE power_source = ? AND sub_type = ? AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                           inserts = [req.body.power_source, req.body.sub_type, start_date, end_date, end_date, start_date];

                       }

               }
       }
           // select all tool and type in key_word
           else if (type.length === 0 && key_word.length !== 0) {
               if (power_source.length ===0){
                   if (sub_type.length === 0){
                       q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE  sub_option LIKE ? AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                       inserts = [ "%" + key_word + "%", start_date, end_date, end_date, start_date];


                   }else{ // choose sub_type
                       q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE  sub_type = ? AND sub_option LIKE ? AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                       inserts = [ req.body.sub_type, "%" + key_word + "%", start_date, end_date, end_date, start_date];


                   }

               }else{  // choose power_source

                   if (sub_type.length === 0){
                       // not choose sub_type
                       q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE power_source = ?  AND sub_option LIKE ? AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                       inserts = [req.body.power_source, "%" + key_word + "%", start_date, end_date, end_date, start_date];


                   }else{  // chose sub_type

                       q = 'SELECT DISTINCT ToolID, power_source, sub_option, sub_type, (0.15 * original_price) AS rental_price, (0.5 * original_price) AS deposit_price FROM Tool WHERE power_source = ? AND sub_type = ? AND sub_option LIKE ? AND ToolID NOT IN (SELECT ToolID FROM Reservation NATURAL JOIN AddRes WHERE start_date > CURDATE() AND (start_date > ? AND start_date < ? OR end_date > ? AND end_date < ?));';
                       inserts = [req.body.power_source, req.body.sub_type, "%" + key_word + "%", start_date, end_date, end_date, start_date];


                   }

               }


           }
       }


        q = mysql.format(q, inserts);
    connection.query(q, function (error, results) {
        if (error) {
            console.log(error);
        } else {
            console.log(results);
            for (var i = 0; i < results.length; i++) {
                if (results[i].power_source.toLowerCase() != 'manual') {
                    results[i].shortDes = results[i].power_source + ' ' + results[i].sub_option + ' ' + results[i].sub_type;
                } else {
                    results[i].shortDes = results[i].sub_option + ' ' + results[i].sub_type;
                }
            }
            res.render('makeReservation', {results : results});
        }

    });

});



//---------------------------reservation summary-----------------------------------
router.get("/reservation_summary",function (req,res) {


    res.render("reservation_summary")


});



router.post("/reservation_summary",function (req,res) {


   console.log(req.user.id);
    var q = 'INSERT INTO Reservation (CustomerID, start_date , end_date) VALUES (?,?,?)';
    var inserts = [req.user.id, req.body.start_date, req.body.end_date];
    q = mysql.format(q, inserts);

    connection.query(q, function (error, results) {
        if (error) throw   error;

        var tools = req.body.tool_id;
        var reservation_id = results.insertId;
        for (var i = 0;i < tools.length;i ++){
            var inserts2 = [tools[i],reservation_id];

            var q1 = 'INSERT INTO AddRes(ToolID,reservationID) VALUES (?,?)';
            q1 = mysql.format(q1,inserts2);
            connection.query(q1, function (error, results) {
                if (error) throw (error);
                console.log(results);
            });
        }
        res.render('reservation_confirmation',{reservation_id : reservation_id});

        });

    });



//-----------------------------------------------------------


router.get("/reservation_confirmation",function (req,res) {


    res.render('reservation_confirmation',{reservation_id:""});

});


module.exports = router;