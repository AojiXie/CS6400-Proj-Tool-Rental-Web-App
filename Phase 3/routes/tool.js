var express = require('express');
var router  = express.Router();
var connection = require('../models/model');
var mysql = require('mysql');

//route:check tool available
router.get("/tool",function (req,res) {
    var results = [];
    res.render('tool', {results : results});
});

router.post("/tool",function (req,res) {
    var start_date = new Date(req.body.start_date);
    var end_date = new Date(req.body.end_date);
    var key_word = req.body.custom_search;
    var type = req.body.tool_type;
    var sub_type = req.body.sub_type;
    var power_source = req.body.power_source;
    var q;
    var inserts;

    console.log(req.body);


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
            //console.log(results);
            for (var i = 0; i < results.length; i++) {
                if (results[i].power_source.toLowerCase() != 'manual') {
                    results[i].shortDes = results[i].power_source + ' ' + results[i].sub_option + ' ' + results[i].sub_type;
                } else {
                    results[i].shortDes = results[i].sub_option + ' ' + results[i].sub_type;
                }
            }
            res.render('tool', {results : results});
        }

    });

});

//route:display tool detail
router.get('/tool/:id/:subType', function(req, res){
    var subType = req.params.subType;

    if (subType.toLowerCase() === 'sander'){
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, power_source, sub_option, sub_type, min_rpm_rating, max_rpm_rating, ' +
            'volt_rating, amp_rating, AccessoryName, accessory_quantity, dust_bag, battery_type ' +
            'FROM Tool NATURAL JOIN PowerTool NATURAL JOIN Sander NATURAL LEFT OUTER JOIN Cordless ' +
            'NATURAL LEFT OUTER JOIN Accessory WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].power_source + ' ' + results[0].sub_option + ' ' + results[0].sub_type +
                    ' ' + results[0].volt_rating + ' Volt ' + results[0].amp_rating + ' Amp ' +
                    results[0].min_rpm_rating + ' RPM ' + 'by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'saw') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, power_source, sub_option, sub_type, min_rpm_rating, max_rpm_rating, ' +
            'volt_rating, amp_rating, AccessoryName, accessory_quantity, blade_size, battery_type ' +
            'FROM Tool NATURAL JOIN PowerTool NATURAL JOIN Saw NATURAL LEFT OUTER JOIN Cordless ' +
            'NATURAL LEFT OUTER JOIN Accessory WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].power_source + ' ' + results[0].sub_option + ' ' + results[0].sub_type +
                    ' ' + results[0].volt_rating + ' Volt ' + results[0].amp_rating + ' Amp ' +
                    results[0].min_rpm_rating + ' RPM ' + results[0].blade_size + ' in. ' + 'by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'drill') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, power_source, sub_option, sub_type, min_rpm_rating, max_rpm_rating, ' +
            'volt_rating, amp_rating, AccessoryName, accessory_quantity, min_torque_rating, battery_type ' +
            'FROM Tool NATURAL JOIN PowerTool NATURAL JOIN Drill NATURAL LEFT OUTER JOIN Cordless ' +
            'NATURAL LEFT OUTER JOIN Accessory WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].power_source + ' ' + results[0].sub_option + ' ' + results[0].sub_type +
                    ' ' + results[0].volt_rating + ' Volt ' + results[0].amp_rating + ' Amp ' +
                    results[0].min_rpm_rating + ' RPM ' + results[0].min_torque_rating + ' ft-lb ' + 'by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'air_compressor') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, power_source, sub_option, sub_type, min_rpm_rating, max_rpm_rating, ' +
            'volt_rating, amp_rating, AccessoryName, accessory_quantity, tank_size, pressure_rating ' +
            'FROM Tool NATURAL JOIN PowerTool NATURAL JOIN AirCompressor NATURAL LEFT OUTER JOIN Accessory WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].power_source + ' ' + results[0].sub_option + ' ' + results[0].sub_type +
                    ' ' + results[0].volt_rating + ' Volt ' + results[0].amp_rating + ' Amp ' +
                    results[0].min_rpm_rating + ' RPM ' + results[0].tank_size + ' gallon ' + results[0].pressure_rating + ' psi ' + 'by ' +
                    results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'mixer') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, power_source, sub_option, sub_type, min_rpm_rating, max_rpm_rating, ' +
            'volt_rating, amp_rating, AccessoryName, accessory_quantity, motor_rating, drum_size ' +
            'FROM Tool NATURAL JOIN PowerTool NATURAL JOIN Mixer NATURAL LEFT OUTER JOIN Accessory WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].power_source + ' ' + results[0].sub_option + ' ' + results[0].sub_type +
                    ' ' + results[0].volt_rating + ' Volt ' + results[0].amp_rating + ' Amp ' +
                    results[0].min_rpm_rating + ' RPM ' + results[0].motor_rating + ' HP ' + results[0].drum_size + ' cu-ft ' + 'by ' +
                    results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'generator') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, power_source, sub_option, sub_type, min_rpm_rating, max_rpm_rating, ' +
            'volt_rating, amp_rating, AccessoryName, accessory_quantity, power_rating ' +
            'FROM Tool NATURAL JOIN PowerTool NATURAL JOIN Generator NATURAL LEFT OUTER JOIN Accessory WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].power_source + ' ' + results[0].sub_option + ' ' + results[0].sub_type +
                    ' ' + results[0].volt_rating + ' Volt ' + results[0].amp_rating + ' Amp ' +
                    results[0].min_rpm_rating + ' RPM ' + results[0].power_rating + ' Watt ' + 'by ' +
                    results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'step') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, sub_option, sub_type, step_count, weight_capacity ' +
            'FROM Tool NATURAL JOIN Step WHERE Tool.ToolID = ?';
        var insert = [req.params.id];

        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(results);
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].sub_option + ' ' + results[0].sub_type + ' ' + results[0].step_count + ' -step ' +
                    results[0].weight_capacity + ' lb.capacity ' + 'by ' +
                    results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'straight') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, sub_option, sub_type, step_count, weight_capacity ' +
            'FROM Tool NATURAL JOIN Straight WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].sub_option + ' ' + results[0].sub_type +
                    ' ' + results[0].step_count + ' -step ' + results[0].weight_capacity + ' lb.capacity ' + 'by ' +
                    results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'screwdriver') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, sub_option, sub_type, screw_size ' +
            'FROM Tool NATURAL JOIN Screwdriver WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].sub_option + ' ' + results[0].sub_type +
                    ' ' + '#' + results[0].screw_size +  ' by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'ratchet') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, sub_option, sub_type, drive_size ' +
            'FROM Tool NATURAL JOIN Rachet WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].sub_option + ' ' + results[0].sub_type +
                    ' ' + results[0].dirve_size + ' in.' + ' by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'plier') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, sub_option, sub_type ' +
            'FROM Tool NATURAL JOIN Plier WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].sub_option + ' ' + results[0].sub_type +
                    ' by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'hammer') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, sub_option, sub_type ' +
            'FROM Tool NATURAL JOIN Hammer WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].sub_option + ' ' + results[0].sub_type +
                    ' by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'gun') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, sub_option, sub_type, gauge_rating, capacity ' +
            'FROM Tool NATURAL JOIN Gun WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].sub_option + ' ' + results[0].sub_type +
                    ' ' + results[0].gauge_rating + ' G ' + results[0].capacity + ' nails' + ' by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'socket') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, sub_option, sub_type, drive_size, sae_size ' +
            'FROM Tool NATURAL JOIN Socket WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].sub_option + ' ' + results[0].sub_type +
                    ' ' + results[0].drive_size + ' in. ' + results[0].sae_size + ' in.' + ' by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'wrench') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, sub_option, sub_type ' +
            'FROM Tool NATURAL JOIN Wrench WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].sub_option + ' ' + results[0].sub_type +
                    ' by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'striking') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, sub_option, sub_type, head_weight ' +
            'FROM Tool NATURAL JOIN Striking WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].sub_option + ' ' + results[0].sub_type + ' ' +
                    results[0].head_weight + ' lb. axe head weight' + ' by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'pruner') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, sub_option, sub_type, blade_material, blade_length ' +
            'FROM Tool NATURAL JOIN Pruner WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].sub_option + ' ' + results[0].sub_type + ' ' +
                    results[0].blade_material + ' ' + results[0].blade_length + ' in.' + ' by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'digger') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, sub_option, sub_type, blade_width, blade_length ' +
            'FROM Tool NATURAL JOIN Digger WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].sub_option + ' ' + results[0].sub_type + ' ' +
                    results[0].blade_width + ' ' + results[0].blade_length + ' in.' + ' by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'rakes') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, sub_option, sub_type, tine_count ' +
            'FROM Tool NATURAL JOIN Rakes WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].sub_option + ' ' + results[0].sub_type + ' ' +
                    results[0].tine_count + ' tine' + ' by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    } else if (subType.toLowerCase() === 'wheelbarrows') {
        var q = 'SELECT Tool.ToolID, type, weight, length, width, material, manufacturer, (0.4*original_price) AS deposit_price, ' +
            '(0.15*original_price) AS rental_price, sub_option, sub_type, bin_material, bin_volume, wheel_count ' +
            'FROM Tool NATURAL JOIN Wheelbarrows WHERE Tool.ToolID = ?';
        var insert = [req.params.id];
        q = mysql.format(q, insert);

        connection.query(q, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                results[0].fullDes = results[0].width + ' in. W ' + results[0].length + ' in. L ' + results[0].weight +
                    ' lb. ' + results[0].sub_option + ' ' + results[0].sub_type + ' ' +
                    results[0].bin_material + ' ' + results[0].bin_volume + ' cu ft ' + results[0].wheel_count + ' wheeled'
                ' by ' + results[0].manufacturer;
                res.render('toolDetail', {results : results});
            }
        });
    }
});


module.exports = router;