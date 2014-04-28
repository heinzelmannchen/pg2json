var connection = require('./lib/connection'),
    columns = require('./lib/columns'),
    tables = require('./lib/tables'),
    relations = require('./lib/relations'),
    fsUtil = require('heinzelmannchen-fs'),
    Q = require('q'),
    me = module.exports;

me.connect = function(config) {
    return connection.connect(config);
};

me.get = function(tableNames) {
    return tables.get(tableNames);
};

me.getTableNames = function(){
    return tables.getMetadata();
};

me.getColumns = function(tableName) {
    return columns.get(tableName);
};

me.getRelations = function(tableName) {
    return relations.get(tableName);
};

me.write = function(path, content, options) {
    return fsUtil.createFile(path, content, options);
};
