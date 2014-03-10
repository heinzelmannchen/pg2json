var connection = require('./lib/connection'),
    columns = require('./lib/columns'),
    tables = require('./lib/tables'),
    me = module.exports;

me.connect = function(config) {
    return connection.connect(config);
};

me.getTables = function() {
    return tables.getTables();
};

me.getColumns = function(tableName) {
    return columns.get(tableName);
};
