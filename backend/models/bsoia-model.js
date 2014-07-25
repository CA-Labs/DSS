/**
 * Created by Jordi Aranda.
 * 24/07/14
 * <jordi.aranda@bsc.es>
 */

var Foxx = require('org/arangodb/foxx'),
    joi = require('joi'),
    AssetModel = require('backend/models/asset-model').model,
    BSOIAModel = AssetModel.extend({});

exports.model = BSOIAModel;

