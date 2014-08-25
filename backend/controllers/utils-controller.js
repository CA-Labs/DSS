(function(){

    'use strict';

    var Foxx            = require('org/arangodb/foxx'),
        controller      = new Foxx.Controller(applicationContext),
        dssXMLParser    = require('../utils/xml-parser').dssXMLParser,
        fs              = require('fs');

    // Initialize dssXMLParser with current DSS XSD schema (yeah, it should not block, I know...)
    var xsdSchema = fs.readFileSync('../resources/resource-model-extension.xsd.xml').toString();
    dssXMLParser.loadSchema(xsdSchema);

    /**
     * Validates cloud resource descriptor xml file against DSS XSD schema
     */
    controller.post('validateDocument', function(req, res){
        var xmlString = req.body().xmlString;
        var xmlDocument = dssXMLParser.loadDocument(xmlString);
        var correct = dssXMLParser.validateXML(xmlDocument);
        res.json({correct: correct});
    });

}());
