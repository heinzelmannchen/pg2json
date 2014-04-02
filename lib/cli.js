var program = require('commander'),
    Q = require('q'),
    winston = require('winston'),
    inquirer = require('inquirer'),
    _ = require('underscore'),
    Table = require('cli-table'),
    pg2json = require('..'),
    connection = require('../lib/connection'),
    tables = require('../lib/tables'),
    columns = require('../lib/columns'),
    relations = require('../lib/relations'),
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
            .then(tables.get)
            .then(listTables)
            .fail(onFail);
    } else {
        program.help();
    }
};

function listTables(tables) {
    var tablesChoices = _.map(tables, function(table) {
        return table.table_name;
    });
    inquirer.prompt([{
        type: 'checkbox',
        name: 'tables',
        message: 'Select a table',
        choices: tablesChoices
    }], function(choices) {
        var promises = [];
        _.each(choices.tables, function(table) {
            winston.data('Table: ' + table);
            promises.push(columns.get(table)
                .then(function(columns){
                    listColumns(table, columns);
                }));
            promises.push(relations.get(table)
                .then(function(relations){
                    listRelations(table, relations);
                }));
        });
        Q.allSettled(promises)
            .then(finished)
            .catch (onFail);
    });
}

function listColumns(tableName, columns) {
    var table = new Table({
        head: ['Name', 'Type']
    });
    _.each(columns, function(column, key) {
        table.push(
            [column.column_name, column.data_type]
        );
    });
    if (table.length > 0){
        winston.info(tableName + ' columns');
        console.log(table.toString());
    }
}

function listRelations(tableName, relations) {
    var table = new Table({
        head: ['Foreign Key', 'Referenced Table', 'Referenced Column']
    });
    _.each(relations, function(relation) {
        table.push(
            [relation.fk_column_name, relation.referenced_table_name, relation.referenced_column_name]
        );
    });
    if (table.length > 0){
        winston.info(tableName + ' relations');
        console.log(table.toString());
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
    process.kill();
}

function onFail(error) {
    winston.error('Message: ' + error.message);
    if (program.debug) {
        winston.data(error);
    }
    if (program.trace) {
        console.trace();
    }
    process.kill();
}
