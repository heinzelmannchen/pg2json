var Q = require('q'),
    fsUtil = require('heinzelmannchen-fs'),
    me = module.exports;

me.connect = function(configOrFile) {
    var q, config;

    if (typeof configOrFile === 'object') {
        q = Q.defer();
        config = configOrFile;
        q.resolve({});
        return q.promise;
    } else {
        return fsUtil.readFileOrReturnData(configOrFile)
            .thenResolve({})
            .thenReject();
    }
};
