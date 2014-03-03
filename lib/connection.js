var Q = require('q'),
    fsUtil = require('heinzelmannchen-fs'),
    Knex = require('knex'),
    me = module.exports;


me.connect = function(configOrFile) {

    if (typeof configOrFile === 'object') {
        return me.initializeKnex(configOrFile);
    } else {
        return fsUtil.readFileOrReturnData(configOrFile)
            .then(me.initializeKnex);
    }
};

me.initializeKnex = function(config) {
    var q = Q.defer(),
        knex;

    try {
        knex = Knex.initialize({
            client: 'pg',
            connection: {
                host: '10.2.83.80',
                user: 'admin',
                password: 'ok18da16',
                database: 'kpc',
                charset: 'utf8'
            }
        });
        q.resolve(knex);
    } catch (error) {
        q.reject(error);
    }

    return q.promise;
};
