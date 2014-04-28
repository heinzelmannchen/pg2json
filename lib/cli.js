var program = require('commander'),
    Q = require('q'),
    winston = require('winston'),
    inquirer = require('inquirer'),
    _ = require('underscore'),
    Table = require('cli-table'),
    pg2json = require('../pg2json'),
    connection = require('../lib/connection'),
    me = module.exports;

me.start = function(argv) {
    me.setup();
    program.parse(argv);
    me.run();
};

me.setup = function() {
    program
        .description('reads the schema of a db and creates a json-schema')
        .option('-c, --config [value]', 'db-config file')
        .option('-o, --output [value]', 'output filename')
        .option('-s, --silent', 'no console output')
        .option('-f, --force', 'override file if existing')
        .option('-d, --dry-run', 'don\'t create files')
        .option('-D, --debug', 'print error object')
        .option('-T, --trace', 'print stacktrace')
        .version('0.0.1');
    winston.cli();
};

me.run = function() {
    if (program.silent) {
        winston.clear();
    }

    if (program.config) {
        connection.connect(program.config)
            .then(pg2json.getTableNames)
            .then(listTableChoices)
            .then(loadSelectedTables)
            .then(listTables)
            .then(write)
            .then(finished)
            .fail(onFail);
    } else {
        program.help();
    }
};

function listTableChoices(tables) {
    var q = Q.defer(),
        tablesChoices = _.map(tables, function(table) {
        return table.table_name;
    });

    inquirer.prompt([{
        type: 'checkbox',
        name: 'tables',
        message: 'Select a table',
        choices: tablesChoices
    }], function onSelected(choices) {
        var promises = [];
        var selectedTables = _.filter(tables, function(table) {
            return _.contains(choices.tables, table.table_name);
        });
        q.resolve(_.map(selectedTables, function(table){ return table.table_name; }));
    });
    return q.promise;
}

function loadSelectedTables(tableNames){
    if (tableNames.length > 0) {
        return pg2json.get(tableNames);
    } else {
        winston.info('no table selected');
        process.exit(1);
    }
}

function listTables(tables){
    if (!program.silent){
        _.each(tables, function(table){
            winston.data('Table: ' + table.table_name);
            listColumns(table);
            listRelations(table);
        });
    }
    return tables;
}

function listColumns(tableData) {
    var table = new Table({
        head: ['Name', 'Type']
    });
    _.each(tableData.columns, function(column, key) {
        table.push(
            [column.column_name, column.data_type]
        );
    });
    if (table.length > 0){
        winston.info(tableData.table_name + ' columns');
        console.log(table.toString());
    }
}

function listRelations(tableData) {
    var table = new Table({
        head: ['Foreign Key', 'Referenced Table', 'Referenced Column']
    });
    _.each(tableData.relations, function(relation) {
        table.push(
            [relation.fk_column_name, relation.referenced_table_name, relation.referenced_column_name]
        );
    });
    if (table.length > 0){
        winston.info(tableData.table_name + ' relations');
        console.log(table.toString());
    }
}

function write(tablesToWrite) {
    var tablesAsJson;
    if(program.output && !program.dryRun){
        tablesAsJson = JSON.stringify(tablesToWrite);
        return pg2json.write(program.output, tablesAsJson, {override: program.force})
                .then(function(){
                    winston.info('File written to: ', program.output);
                });
    }
}

function finished(path) {
    if (path) {
        winston.info('File writen to: ', path);
    }
    winston.info('Successfull!');
    if (program.dryRun) {
        winston.warn('THIS WAS A DRY RUN');
        winston.warn('nothing has been writen');
    }
    process.exit(1);
}

function onFail(error) {
    winston.error('Message: ' + error.message);
    if (program.debug) {
        winston.data(error);
    }
    if (program.trace) {
        console.trace();
    }
    process.exit(-1);
}