var program = require('commander'),
    winston = require('winston'),
    inquirer = require('inquirer'),
    _ = require('underscore'),
    Table = require('cli-table'),
    pg2json = require('..'),
    connection = require('../lib/connection'),
    tables = require('../lib/tables'),
    columns = require('../lib/columns'),
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
        .option('-l, --delimiter [value]', 'template delimiter')
        .option('-s, --silent', 'no console output')
        .option('-f, --force', 'create folders if not existing')
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
            .then(tables.getTables)
            .then(listTables)
            .fail(onFail);

    }
};

function listTables(tables) {
    var tablesChoices = _.map(tables, function(table) {
        return table.table_name;
    });
    inquirer.prompt([{
        type: 'list',
        name: 'table',
        message: 'Select a table',
        choices: tablesChoices
    }], function(choice) {
        columns.get(choice.table)
        .then(listColumns)
        .catch (onFail);
    });
}

function listColumns(columns) {
    var table = new Table({
        head: ['Name', 'Type']
    });
    _.each(columns, function(column, key) {
        table.push(
            [column.column_name, column.data_type]
        );
    });
    console.log(table.toString());
    finished();
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
