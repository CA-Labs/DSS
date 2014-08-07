/**
 * Provider Model
 * @author: Jacek Dominiak
 * @copyright: Jacek Dominiak
 * @created: 22/07/14
 */

var Foxx = require('org/arangodb/foxx'),
    joi = require('joi'),
    ProviderModel = Foxx.Model.extend({
        schema: {
            name: joi.string().required(),
            type: joi.string().required().default('provider'),
            year_founding: joi.number().min(1800).max(new Date().getFullYear()).optional(),
            website: joi.string().optional().regex(new RegExp("(http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?")),
            logo_url: joi.string().optional().regex(new RegExp("(http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?")),
            description: joi.string().required(),
            number_of_employees: joi.number().optional(),
            headquarters: joi.string().optional(),
            headquarters_country: joi.string().optional(),
            headquarters_continent: joi.string().optional(),
            stock: joi.string().optional()
        }
    });

exports.model = ProviderModel;
