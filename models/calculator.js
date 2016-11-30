var _ = require('lodash');

class Calculator {
  static getTotalWeightLost(averages, weights, user) {
    // if (weights[user.dietingStartDate])
    return (weights[user.dietingStartDate] - parseFloat(_.meanBy(averages, 'weight'))).toFixed(2);
  }
}

module.exports = Calculator;