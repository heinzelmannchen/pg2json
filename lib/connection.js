var Q = require('q'),
    fsUtil = require('heinzelmannchen-fs'),
    Knex = require('knex'),
    me = module.exports;

me.setKnex = function(mockKnex) {
    Knex = mockKnex;
};

me.connect = function(configOrFile) {
    var q;
    if (Knex.knex) {
        q = Q.defer();
        q.resolve(Knex.knex);
        return q.pormise;
    }

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
    var q = Q.defer();

    try {
        Knex.knex = Knex.initialize({
            client: 'pg',
            connection: config
        });
        q.resolve(Knex.knex);
    } catch (error) {
        q.reject(error);
    }

    return q.promise;
};

me.getConn = function() {
    return Knex.knex;
};
