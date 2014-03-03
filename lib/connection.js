var Q = require('q'),
    fsUtil = require('heinzelmannchen-fs'),
    Knex = require('knex'),
    me = module.exports;

me.setKnex = function(mockKnex) {
    Knex = mockKnex;
};

me.connect = function(configOrFile) {

    if (typeof configOrFile === 'object') {
        return me.initializeKnex(configOrFile);
    } else {
        return fsUtil.readFileOrReturnData(configOrFile)
            .then(function(config) {
                return me.initializeKnex(JSON.parse(config));
            });
    }
};

me.initializeKnex = function(config) {
    var q = Q.defer(),
        knex;

    try {
        knex = Knex.initialize({
            client: 'pg',
            connection: config
        });
        q.resolve(knex);
    } catch (error) {
        q.reject(error);
    }

    return q.promise;
};
