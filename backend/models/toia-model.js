/**
 * Created by Jordi Aranda.
 * 24/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx = require('org/arangodb/foxx'),
    joi = require('joi'),
    AssetModel = require('backend/models/asset-model').model,
    TOIAModel = AssetModel.extend({});

exports.model = TOIAModel;
