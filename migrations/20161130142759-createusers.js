'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.createTable('users', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    firstName: 'string',
    lastName: 'string',
    TDEE: 'int',
    dietingStartDate: 'date',
    currentWeightLossRate: 'decimal',
    desiredWeightLossRate: 'decimal',
    totalWeightLost: 'decimal',
    proteinGrams: 'decimal',
    carbsGrams: 'decimal',
    fatGrams: 'decimal'
  });
  return null;
};

exports.down = function(db) {
  db.dropTable('users');
  return null;
};

exports._meta = {
  "version": 1
};
