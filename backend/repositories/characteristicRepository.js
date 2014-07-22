/**
 * Characteristic Repository
 * @author: Jacek Dominiak
 * @copyright: Jacek Dominiak
 * @created: 22/07/14
 */

var FoxxRepository = require('org/arangodb/foxx').Repository,
    Characteristic = require('../models/charactersiticModel').model,
    CharacteristicRepository = FoxxRepository.extend({
        getAll: function() {
            return Characteristic.all().toArray();
        },
        get: function (key) {
            return Characteristic.byId(key);
        },
        update: function (key, data) {
            return Characteristic.replaceById(key, data);
        },
        create: function (data) {
            return Characteristic.save(data);
        },
        delete: function (key) {
            return Characteristic.remove(key);
        }
    });

exports.repository = CharacteristicRepository;