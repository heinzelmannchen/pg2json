require('../../lib/connection').connect('./integrationTests/db/db-config.json')
    .then(function(knex) {
        return knex.schema.hasTable('heinzel')
            .then(function(exists) {
                if (exists) {
                    return knex.schema.dropTable('heinzel');
                }
            })
            .then(function() {
                return knex.schema.hasTable('occupation');
            })
            .then(function(exists) {
                if (exists) {
                    return knex.schema.dropTable('occupation');
                }
            })
            .then(function() {
                return knex.schema.hasTable('gender');
            })
            .then(function(exists) {
                if (exists) {
                    return knex.schema.dropTable('gender');
                }
            })
            .catch(function(error) {
                console.warn(error);
            });
    });