/**
 * weight-tracking for the neurotic
 */

const DESIRED_WEIGHTLOSS_PER_WEEK = 1.5; // in lbs

var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var _       = require('lodash');

// Day i started my diet to another year in the future.
var url = 'http://www.myfitnesspal.com/reports/printable_diary/prlaugh?from=2016-11-1&to=2017-11-1';


/**
 * Modifies our averages object
 * @param averages
 * @returns {Array}
 */
function updateCurrentWeightLossRate(averages) {
  averages.filter((el, i) => {
    return averages[i + 1];
  }).forEach((el, i) => {
    el.weightLossRate = el.weight - averages[i + 1].weight;
  });
}

request(url, function (error, response, html) {
  if (error) {
    throw error;
  }

  var $       = cheerio.load(html);
  var totals  = [];
  var weights = JSON.parse(fs.readFileSync('./weight-log.json'));
  // var weightsValuesArr = _.mapValues(weights);

  // console.log($('table'));
  $('.main-title-2').each(function (index) {
    var date       = new Date(Date.parse($(this).text()));
    var dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    var table      = $(this).next('table');
    var total      = $('tfoot .first', table).next().text();
    var totalInt   = parseInt(total.replace(/,/g, ''), 10);

    if (totalInt >= 1500) {
      totals.push({
        date: dateString,
        total: totalInt,
        weight: null
      });
    }
  });

  /**
   * Add corresponding date to totals dictionary
   */
  totals.forEach(el => {
    el.weight = weights[el.date];
  });

  /**
   * pluck out any days with unlogged weight
   */
  _.remove(totals, {weight: undefined});

  var totalsChunkedByWeek = _.chunk(totals, 7);
  var averages            = [];

  totalsChunkedByWeek.forEach(function (week) {
    averages.push({
      weekOf: week[0].date,
      calories: _.meanBy(week, 'total'),
      weight: _.meanBy(week, 'weight'),
      weightLossRate: null
    });
  });

  updateCurrentWeightLossRate(averages);


  /**
   * get the averages of the averages for determining final TDEE
   * and current average weightloss
   */

  function calculateGoals(averages, desiredWeightlossPerWeek) {
    const CALORIES_IN_FAT     = 3500;
    var averageCalories       = _.meanBy(averages, 'calories');
    var currentWeightLossRate = _.meanBy(averages, 'weightLossRate');
    var currentDeficit        = (CALORIES_IN_FAT * currentWeightLossRate) / 7;
    var desiredDeficit        = (CALORIES_IN_FAT * desiredWeightlossPerWeek) / 7;
    var deficitDiff           = desiredDeficit - currentDeficit;
    var TDEE                  = averageCalories + currentDeficit;
    var recommendedCalories   = TDEE - desiredDeficit;

    return {
      TDEE,
      currentWeightLossRate,
      recommendedCalories
    }
  }

  var goals = calculateGoals(averages, DESIRED_WEIGHTLOSS_PER_WEEK);
  console.log(goals);

});
