var connection = require('./lib/connection'),
    _ = require('underscore'),
    injections = {
        Q: require('q'),
        _: _,
        Knex: require('knex')
    },
    dataTypesMapping = {},
    columns = require('./lib/columns')(_.extend(injections, {
        dataTypes: dataTypesMapping
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

me.setDataTypeMapper = function (mapper) {
    dataTypesMapping.map = mapper.map;
};

me.getRelations = function(tableName) {
    return relations.get(tableName);
};

me.write = function(path, content, options) {
    return fsUtil.createFile(path, content, options);
};
