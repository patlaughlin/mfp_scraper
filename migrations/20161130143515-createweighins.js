'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm  = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  db.createTable('weighins', {
    id: {type: 'int', primaryKey: true, autoIncrement: true},
    date: 'date',
    weight: 'decimal',
    users_id: 'int'
  }, function () {
    db.addForeignKey('weighins', 'users', 'weighins_users_foreign',
      {
        'users_id': 'id'
      },
      {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      });
  });

  return null;
};

exports.down = function (db) {
  db.dropTable('weighins');
  return null;
};

exports._meta = {
  "version": 1
};
