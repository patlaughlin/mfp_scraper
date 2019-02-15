const _ = require('lodash');
const csv = require('csvtojson');

/**
 * Update here what date we want to retrieve
 * year-month-day
 * 2019-01-05
 * @type {string}
 */
const dateToFormat = '2019-02-05';

/**
 * NOTE: we're only doing straight sets of weight right now. this could change in the future
 * the below method assume that its only straight sets across
 * @param weights
 * @returns {*}
 */
const cleanOutWarmups = weights => {
    return _.filter(weights, (weight, i) => {
        if ((i + 1) === _.size(weights)) {
            return weight;
        }
        return weight === weights[i + 1];
    });
};

_.mixin({cleanOutWarmups});

const formatDataForLogbook = data => {
    let formatted = data.filter(datum => {
        return _.includes(datum.Date, dateToFormat);
    });

    const exercises = _.chain(formatted).map('Exercise Name').uniq().value();
    formatted = _.groupBy(formatted, 'Exercise Name');
    /**
     * sort the list from least to greatest
     */

    console.log(dateToFormat);

    exercises.forEach(exercise => {
        const group = formatted[exercise];
        /**
         * find out if this was an exercise that included warm up sets. If so, pluck those sets out.
         */
        const weight = _.chain(group).map(g => _.parseInt(g.Weight)).cleanOutWarmups().value();
        const reps = _.map(group, 'Reps');
        const logString = `${_.size(weight)} x ${_.head(reps)}-${_.last(reps)} x ${_.round(_.mean(weight))}lbs`;
        console.log(exercise);
        console.log(logString);
        console.log('\n');
    });
};

csv()
    .fromFile('./data/strong.csv')
    .then(formatDataForLogbook);

