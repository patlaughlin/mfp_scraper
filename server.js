var User = require('./models/user');
var Calculator = require('./models/calculator');
/**
 * weight-tracking for the neurotic
 */

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var parse = require('csv-parse/lib/sync');
const moment = require('moment');

// Day i started my diet to another year in the future.
var url = 'http://www.myfitnesspal.com/reports/printable_diary/prlaugh?from=2020-01-01&to=2021-01-01';

var user = new User({
    firstName: 'Patrick',
    desiredWeightLossRate: -1.5,
    dietingStartDate: '2016-11-21'
});

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

    var $ = cheerio.load(html);
    var totals = [];
    let updatedWeights = [];

    $('.main-title-2').each(function (index) {
        const date = moment(Date.parse($(this).text())).format('YYYY-MM-DD');
        const table = $(this).next('table');
        const $total = $('tfoot .first', table).next();
        const total = $total.text();
        const gCarbs = parseInt($total.next().text(), 10);
        const gFat = parseInt($total.next().next().text(), 10);
        const gProtein = parseInt($total.next().next().next().text(), 10);
        const totalInt = parseInt(total.replace(/,/g, ''), 10);

        let realCalories = ((gCarbs * 4) + (gFat * 9) + (gProtein * 4));

        console.log(`${date}: ${gCarbs}, ${gFat}, ${gProtein}`);
        // if (realCalories <= 1600) {
        //     realCalories = 2400;
        // }
    });


    /**
     * Begin TDEE work
     * @param startDate
     * @param weights
     * calories_consumed_in_a_week + (((-weight_lost_from_start) * calories_in_pound) / days_in_week))
     */
    function getTDEE(startDate, weights) {
        const filteredWeights = _.dropWhile(weights, weight => {
            return moment(weight.Date).isBefore(startDate)
        });
        const startWeight = _.find(filteredWeights, ['Date', startDate]).Recorded;
        const dataByWeek = _.groupBy(filteredWeights, (result) => moment(result['Date'], 'YYYY-MM-DD').startOf('isoWeek'));
        /**
         * create a collection with average calories in a week, weight lost from start, and the date of that week
         */
        let meanData = _.map(dataByWeek, (week, index) => {
            const weight = _.meanBy(week, 'Recorded');
            const calories = _.round(_.meanBy(week, 'Calories'), 0);
            let weightDiff = 0;
            if (index === 0) {
                weightDiff = _.round(weight - startWeight, 2);
            }

            return {date: _.head(week).Date, weight, weightDiff, calories, rowCount: _.size(week)};
        });

        meanData = _.map(meanData, (data, index) => {
            const weightDiff = index === 0 ? data.weightDiff : _.round(data.weight - meanData[index - 1].weight, 2);
            return {...data, weightDiff};
        });

        meanData = meanData.map(data => {
            const TDEE = data.calories + (((-data.weightDiff) * 3500) / data.rowCount);
            return {...data, TDEE}
        });

        return _.round(_.meanBy(meanData, 'TDEE'), 0);
    }

    function getTargetCalories(TDEE, goalWeightDiffPerWeek, isLoss = true) {
        return TDEE - (goalWeightDiffPerWeek * 3500) / 7;
    }


    function calculateWeightLossMacros(currentWeight, calories, user) {
        var gProtein = currentWeight;
        var percentage = (((currentWeight * 4) / calories) + .25) * 100;
        var carbsPerc = 100 - percentage;
        var gCarbs = ((carbsPerc / 100) * calories) / 4;
        var gFat = (calories * 0.25) / 9;

        user.proteinGrams = gProtein.toFixed(2);
        user.carbsGrams = gCarbs.toFixed(2);
        user.fatGrams = gFat.toFixed(2);
    }

    // const myTDEE = getTDEE('2019-03-20', updatedWeights);
    // const targetCalories = getTargetCalories(myTDEE, 1);
    // console.log(`TDEE: ${myTDEE}`);
    // console.log(`You should eat: ${targetCalories} calories per day`);
});

