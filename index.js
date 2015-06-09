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
var config = require('./config');
var sendgrid = require('sendgrid')(config.SendGridUser, config.SendGridPass);

/**
 * Params
 */
var n = 0;

/**
 * Telegraph
 */
fs.readFile('lists/hospital_emails_one.csv', 'utf8', function (error, data) {
    csv.parse(data, function (err, data) {
        if (err) {
            return console.log(err);
        } else {
            for (var key in data) {
                var row = data[key];
                if (data.hasOwnProperty(key)) {
                    if (row[0] != '') {
                        // SendGrid
                        var email = new sendgrid.Email({
                            to: '' + row[0] + '',
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
                            } else {
                                n++;
                                console.error(json, n);
                            }
                        });
                    }
                }
            }
        }
    });
});
