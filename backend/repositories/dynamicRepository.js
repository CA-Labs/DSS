/**
 *  Dynamic Repository
 *
 * @author: Jacek Dominiak
 * @copyright: Jacek Dominiak
 * @created: 22/07/14
 */

var FoxxRepository = require('org/arangodb/foxx').Repository,
    DynamicRepository = FoxxRepository.extend({});

exports.repository = DynamicRepository;