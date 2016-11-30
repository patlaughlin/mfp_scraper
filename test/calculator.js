var assert     = require('assert');
var Calculator = require('../models/calculator');

describe('Calculator', function () {
  describe('getTotalWeightLost()', function () {
    it('should return undefined if user start date is not in the weight log', function () {
      Calculator.getTotalWeightLost(averages, weights, user);
      // assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});