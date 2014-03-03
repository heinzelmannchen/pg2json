require('../../lib/connection').connect('./integrationTests/db/db-config.json')
    .then(function(knex) {
        knex.schema.hasTable('heinzel').then(function(exists) {
            if (!exists) {
                return knex.schema.createTable('heinzel', function(t) {
                    t.increments('id').primary();
                    t.string('name', 100);
                    t.string('hat_color', 100);
                    t.text('age');
                });
            }
        }).catch(function() {
            console.warn('heinzel already exists');
        });

        knex.schema.hasTable('occupation').then(function(exists) {
            if (!exists) {
                return knex.schema.createTable('occupation', function(t) {
                    t.increments('id').primary();
                    t.string('occupation', 100);
                });
            }
        }).catch(function() {
            console.warn('heinzel already exists');
        });
    })
    .catch(function(error) {
        console.error(error);
    });
