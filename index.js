/**
 * DataRiver Telegraph
 *
 * Send email utilizing SendGrid's Transactional
 * Email API with node.js parallel procesing.
 *
 * Created by gortiz on 6/8/15.
 */

/**
 * Dependencies
 */
var fs = require('fs');
var csv = require('csv');
var async = require('async');
var config = require('./config');
var sendgrid = require('sendgrid')(config.SendGridUser, config.SendGridPass);

/**
 * Params
 */
var asyncFunctions = [];
var emails = [];
var n = 0;
var i = 0;


/**
 * Telegraph
 */
var file = fs.readFileSync('hospitalEmails.csv');
csv.parse(file, function (err, data) {
    if (err) {
        return console.log(err);
    } else {
        for (var key in data) {
            var row = data[key];
            if (data.hasOwnProperty(key)) {
                if (row[0] != '') {
                    emails.push(row[0]);
                }
            }
            asyncFunctions.push(function (callback) {
                var emailAddress = emails[i];
                // SendGrid
                var email = new sendgrid.Email({
                    to: '' + emailAddress + '',
                    from: '' + config.emailFrom + '',
                    fromname: '' + config.emailFromName + '',
                    subject: '' + config.emailSubject + '',
                    text: '' + config.emailText + ''
                });
                email.addCategory('SLA Webinar');
                email.addCategory('Telegraph');
                sendgrid.send(email, function (err, json) {
                    if (err) {
                        console.error(err);
                        callback();
                    } else {
                        n++;
                        console.error(emailAddress, json, n);
                        callback();
                    }
                });
                i++;
            });
        }

        async.parallel(
            asyncFunctions,
            function (err, results) {
                if (err) {
                    return console.error(err);
                } else {
                    console.log('Processed ' + n + ' telegraph events.');
                }
            }
        );
    }
});