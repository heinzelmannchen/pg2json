var program = require('commander'),
    winston = require('winston'),
    exec = require('child_process').exec,
    _ = require('underscore'),
    List = require('term-list'),
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
    var list = new List({
        marker: '\033[36m› \033[0m',
        markerLength: 2
    });
    _.each(tables, function(table, key) {
        list.add(key, table.table_name);
    });
    list.start();
    list.draw();
    list.on('keypress', function(key, item) {
        switch (key.name) {
            case 'return':
            case 'l':
                list.stop();
                winston.info(tables[item]);
                columns.get(tables[item].table_name)
                    .then(listColumns)
                    .
                catch (onFail);
                break;
        }
    });
    list.on('empty', function() {
        list.stop();
        finished();
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
