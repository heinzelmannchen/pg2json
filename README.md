<a href="http://promises-aplus.github.com/promises-spec">
    <img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png"
         align="right" valign="top" alt="Promises/A+ logo" />
</a>

pg2json
=======
This module loads postgres meta data and returns it as json.

[![Build Status](https://travis-ci.org/heinzelmannchen/pg2json.png?branch=master)](https://travis-ci.org/heinzelmannchen/heinzelmannchen-template)

Usage
-----

###CLI

1. create a config file:
```javascript
{
    "charset": "utf8",
    "database": "heinzel",
    "host": "127.0.0.1",
    "user": "user",
    "password": "password"
}
```
2. use the cli
```
node bin\cli.js -c configFile -o outputFile
```
use help (-h / -help) for more information
3. select desired table

###Node module
----------
```javascript
var pg2json = require('pg2json');

//1. Setup connection
pg2json.connect({
    charset: 'utf8',
    database: 'test',
    host: '127.0.0.1',
    user: 'user',
    password: 'password'
});

//2. Get tables
pg2json.getTables()
    .then(onTablesRead)
    .fail(onError);

//3. Get columns
pg2json.getColumns('tableName')
    .then(onColumnsRead)
    .fail(onError);

//4. Get relations
pg2json.getRelations('tableName')
    .then(onRelationsRead)
    .fail(onError);
```
