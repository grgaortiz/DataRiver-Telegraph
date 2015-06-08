/**
 * DataRiver Telegraph
 *
 * Send email utilizing SendGrid's Transactional
 * Email API with node.js parallel procesing.
 *
 * Created by gortiz on 6/8/15.
 */

/**
 * Dependices
 */
var sendgrid = require('sendgrid')('grgortiz', '3ataRiver!');
var csv = require('csv');
var async = require('async');

/**
 * Params
 */
var asyncFunctions = [];
var n = 0;

/**
 * Telegraph
 */
var file = fs.readFileSync('/Users/gortiz/PhpstormProjects/HospitalDirectory/emailTest.csv');
csv.parse(file, {delimiter: ','}, function (err, data) {
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var h = data[key];
            if (h[0] != '') {
                asyncFunctions.push(function (callback) {
                    // SendGrid
                    sendgrid.send({
                        to: '' + h[0] + '',
                        from: 'grgaortiz@test.com',
                        subject: 'NodeTest',
                        text: 'My first email through SendGrid.'
                    }, function (err, json) {
                        if (err) {
                            return console.error(err);
                            callback();
                        } else {
                            n++;
                            callback();
                        }
                    });
                });
            }
        }
    }

    async.parallel(
        asyncFunctions,
        function (err, results) {
            console.log('Processed ' + n + ' telegraph events.');
        }
    );
});