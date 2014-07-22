/**
 *  Dynamic Repository
 *
 * @author: Jacek Dominiak
 * @copyright: Jacek Dominiak
 * @created: 22/07/14
 */

var FoxxRepository = require('org/arangodb/foxx').Repository,
    DynamicRepository = FoxxRepository.extend({
        getAll: function (modelName) {
            var model = require('../models/' + modelName + 'Model').model;
            return model.all().toArray();
        },
        getById: function (modelName, key) {
            var model = require('../models/' + modelName + 'Model').model;
            return model.byId(key).toArray();
        },
        getByAttributes: function (modelName, attributeValues) {
            var model = require('../models/' + modelName + 'Model').model;
            return model.byExample(attributeValues).toArray();
        },
        create: function (modelName, data) {
            var model = require('../models/' + modelName + 'Model').model;
            return model.save(data);
        },
        update: function (modelName, key, data) {
            var model = require('../models/' + modelName + 'Model').model;
            return model.replaceById(key, data);
        },
        remove: function (modelName, key) {
            var model = require('../models/' + modelName + 'Model').model;
            return model.remove(key);
        }
    });

exports.repository = DynamicRepository;