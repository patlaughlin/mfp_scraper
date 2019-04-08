const _ = require('lodash');
const csv = require('csvtojson');

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

const getOneRM = (load, reps) => {
    return _.round(load * reps * 0.0333 + load);
};

_.mixin({cleanOutWarmups});


/**
 * data i care about knowing
 * total volume load (reps x sets x load)
 * moving e1rm
 * @param data
 */

/**
 * features:
 * - create ui for this?
 * - block review
 * @param data
 */
const analyze = data => {
    const exercises = _.chain(data).map('Exercise Name').uniq().value();
    const formatted = _.groupBy(data, 'Exercise Name');

    const oneRms = formatted['Chest Press'].map(set => {
        return getOneRM(_.parseInt(set.Weight), _.parseInt(set.Reps));
    });

    console.log(formatted);
    // console.log(oneRms);
};

csv()
    .fromFile('./data/strong.csv')
    .then(analyze);

