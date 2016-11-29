var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var _       = require('lodash');

// Day i started my diet to another year in the future.
var url = 'http://www.myfitnesspal.com/reports/printable_diary/prlaugh?from=2016-11-21&to=2017-11-21';

request(url, function (error, response, html) {
  if (error) {
    throw error;
  }

  var $                = cheerio.load(html);
  var totals           = [];
  var weights          = JSON.parse(fs.readFileSync('./weight-log.json'));
  var weightsValuesArr = _.mapValues(weights);

  // console.log($('table'));
  $('table').each(function (index) {
    var $el   = $(this);
    var total = $('tfoot .first', $el).next().text();
    totals.push(parseInt(total.replace(/,/g, ''), 10));
  });

  var totalsChunkedByWeek = _.chunk(totals, 7);

  var averages = totalsChunkedByWeek.map(function (el) {
    return _.mean(el);
  });

  console.log(averages);


  // console.log(totals);
  // console.log(_.mean(totals));
});
