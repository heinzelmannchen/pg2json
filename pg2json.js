var connection = require('./lib/connection'),
    _ = require('underscore'),
    dataTypeMapping = {},
    injections = {
        Q: require('q'),
        _: _,
        Knex: require('knex')
    },
    columns = require('./lib/columns')(_.extend(injections, {
        dataTypes: dataTypeMapping
    })),
    relations = require('./lib/relations')(injections),
    tables = require('./lib/tables')(_.extend(injections, {
        columns: columns,
        relations: relations
    })),
    fsUtil = require('heinzelmannchen-fs'),
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
    return columns(injections).get(tableName);
};

me.setDataTypeMapping = function (mapper) {
    dataTypeMapping.map = mapper;
};

me.getRelations = function(tableName) {
    return relations.get(tableName);
};

me.write = function(path, content, options) {
    return fsUtil.createFile(path, content, options);
};
