/**
 * Created by Jordi Aranda.
 * 22/08/14
 * <jordi.aranda@bsc.es>
 */

var libxmljs = require('libxmljs');

var dssXMLParser = (function(){

    var _xmlParser = function(){
        this.schema = null;
    };

    _xmlParser.prototype.loadSchema = function(schemaString){
        this.schema = this.loadDocument(schemaString);
    };

    _xmlParser.prototype.loadDocument = function(xmlString){
        return libxmljs.parse(xmlString);
    };

    _xmlParser.prototype.validateXML = function(xmlDocument){
        return xmlDocument.validate(this.schema);
    };

    return _xmlParser;

});

exports.dssXMLParser = dssXMLParser();
