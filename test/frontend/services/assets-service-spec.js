/**
 * Created by Jordi Aranda.
 * 28/07/14
 * <jordi.aranda@bsc.es>
 */

describe('AssetsService - Check methods', function(){

    var dssApp, AssetsService;

    // Load the dssApp, which contains the whole application
    beforeEach(module('dssApp'));

    // Load required services
    beforeEach(inject(function(_AssetsService_){
        AssetsService = _AssetsService_;
    }));

    it('should have addBSOIA method', function(){
        expect((AssetsService.addBSOIA).toBeFunction);
    });

    it('should have removeBSOIA method', function(){
        expect((AssetsService.removeBSOIA).toBeFunction);
    });

    it('should have getBSOIA method', function(){
        expect((AssetsService.getBSOIA).toBeFunction);
    });

    it('should have addTOIA method', function(){
        expect((AssetsService.addTOIA).toBeFunction);
    });

    it('should have removeTOIA method', function(){
        expect((AssetsService.removeTOIA).toBeFunction);
    });

    it('should have getTOIA method', function(){
        expect((AssetsService.getTOIA).toBeFunction);
    });

    it('should have existsTOIAByName method', function(){
        expect((AssetsService.existsTOIAByName).toBeFunction);
    });

    it('should have existsBSOIAinTOIA method', function(){
        expect((AssetsService.existsBSOIAinTOIA).toBeFunction);
    });

    it('should have removeBSOIAfromTOIA method', function(){
        expect((AssetsService.removeBSOIAfromTOIA).toBeFunction);
    });

    it('should have isBSOIALinked method', function(){
        expect((AssetsService.isBSOIALinked).toBeFunction);
    });

    it('should have updateTOIAbyName method', function(){
        expect((AssetsService.updateTOIAbyName).toBeFunction);
    });

    it('should have addTA method', function(){
        expect((AssetsService.addTA).toBeFunction);
    });

    it('should have removeTA method', function(){
        expect((AssetsService.removeTA).toBeFunction);
    });

    it('should have getTA method', function(){
        expect((AssetsService.getTA).toBeFunction);
    });

});

describe('AssetsService - Check methods behaviour', function(){

    var dssApp, AssetsService;

    // Load the dssApp, which contains the whole application
    beforeEach(module('dssApp'));

    // Load required services
    beforeEach(inject(function(_AssetsService_){
        AssetsService = _AssetsService_;
    }));

    afterEach(function(){
        AssetsService.removeAll();
    });

    it('should add a new BSOIA asset and retrieve it back again', function(){

        var bsoia = {
            "type": "bsoia",
            "name": "Customer loyalty",
            "description": "Customer loyalty is all about attracting the right customer, getting them to buy, buy often, buy in higher quantities and bring you even more customers."
        };

        AssetsService.addBSOIA(bsoia);
        var assets = AssetsService.getBSOIA();

        expect(assets.length).toEqual(1);
        expect(assets[0].type).toBe(bsoia.type);
        expect(assets[0].name).toBe(bsoia.name);
        expect(assets[0].description).toBe(bsoia.description);

    });

    it('should add a new BSOIA asset only once, avoiding duplicates', function(){

        var bsoia = {
            "type": "bsoia",
            "name": "Customer loyalty",
            "description": "Customer loyalty is all about attracting the right customer, getting them to buy, buy often, buy in higher quantities and bring you even more customers."
        };

        AssetsService.addBSOIA(bsoia);
        var assets = AssetsService.getBSOIA();
        expect(assets.length).toEqual(1);
        AssetsService.addBSOIA(bsoia);
        expect(assets.length).toEqual(1);

    });

    it('should add a new BSOIA asset and correctly remove it', function(){

        var bsoia = {
            "type": "bsoia",
            "name": "Customer loyalty",
            "description": "Customer loyalty is all about attracting the right customer, getting them to buy, buy often, buy in higher quantities and bring you even more customers."
        };

        AssetsService.addBSOIA(bsoia);
        AssetsService.removeBSOIA(bsoia);

        var assets = AssetsService.getBSOIA();
        expect(assets.length).toEqual(0);

    });

    it('should add a new TOIA asset (with no BSOIA relations) and retrieve it back again', function(){

        var toia = {
            "type": "toia",
            "name": "Data privacy",
            "description": "Data Privacy (or data protection), is the relationship between collection and dissemination of data, technology, the public expectation of privacy, and the legal and political issues surrounding them. Privacy concerns exist wherever personally identifiable information or other sensitive information is collected and stored in digital form or otherwise. Improper or non-existent disclosure control can be the root cause for privacy issues."
        };

        AssetsService.addTOIA(toia);
        var assets = AssetsService.getTOIA();

        expect(assets.length).toEqual(1);
        expect(assets[0].asset.type).toBe(toia.type);
        expect(assets[0].asset.name).toBe(toia.name);
        expect(assets[0].asset.description).toBe(toia.description);
        expect(assets[0].bsoiaRelations.length).toEqual(0);

    });

    it('should add a new TOIA asset (with no BSOIA relations) only once, avoiding duplicates', function(){

        var toia = {
            "type": "toia",
            "name": "Data privacy",
            "description": "Data Privacy (or data protection), is the relationship between collection and dissemination of data, technology, the public expectation of privacy, and the legal and political issues surrounding them. Privacy concerns exist wherever personally identifiable information or other sensitive information is collected and stored in digital form or otherwise. Improper or non-existent disclosure control can be the root cause for privacy issues."
        };

        AssetsService.addTOIA(toia);
        var assets = AssetsService.getTOIA();
        expect(assets.length).toEqual(1);
        AssetsService.addTOIA(toia);
        expect(assets.length).toEqual(1);

    });

    it('should add a new TOIA asset (with no BSOIA relations) and remove it', function(){

        var toiaToAdd = {
            "type": "toia",
            "name": "Data privacy",
            "description": "Data Privacy (or data protection), is the relationship between collection and dissemination of data, technology, the public expectation of privacy, and the legal and political issues surrounding them. Privacy concerns exist wherever personally identifiable information or other sensitive information is collected and stored in digital form or otherwise. Improper or non-existent disclosure control can be the root cause for privacy issues."
        };

        var toiaToRemove = {
            asset: {
                "type": "toia",
                "name": "Data privacy",
                "description": "Data Privacy (or data protection), is the relationship between collection and dissemination of data, technology, the public expectation of privacy, and the legal and political issues surrounding them. Privacy concerns exist wherever personally identifiable information or other sensitive information is collected and stored in digital form or otherwise. Improper or non-existent disclosure control can be the root cause for privacy issues."
            },
            bsoiaRelations: []
        };

        AssetsService.addTOIA(toiaToAdd);
        AssetsService.removeTOIA(toiaToRemove);
        var assets = AssetsService.getTOIA();

        expect(assets.length).toEqual(0);

    });

    it('should check whether a TOIA asset exists by name', function(){

        var toia = {
            "type": "toia",
            "name": "Data privacy",
            "description": "Data Privacy (or data protection), is the relationship between collection and dissemination of data, technology, the public expectation of privacy, and the legal and political issues surrounding them. Privacy concerns exist wherever personally identifiable information or other sensitive information is collected and stored in digital form or otherwise. Improper or non-existent disclosure control can be the root cause for privacy issues."
        };

        AssetsService.addTOIA(toia);
        expect(AssetsService.existsTOIAByName(toia.name)).toBe(true);

    });

    it('should correctly update a TOIA asset with new BSOIA relations and find them', function(){

        var toiaToAdd = {
            "type": "toia",
            "name": "Data privacy",
            "description": "Data Privacy (or data protection), is the relationship between collection and dissemination of data, technology, the public expectation of privacy, and the legal and political issues surrounding them. Privacy concerns exist wherever personally identifiable information or other sensitive information is collected and stored in digital form or otherwise. Improper or non-existent disclosure control can be the root cause for privacy issues."
        };

        var toiaToUpdate = {
            asset: {
                "type": "toia",
                "name": "Data privacy",
                "description": "Data Privacy (or data protection), is the relationship between collection and dissemination of data, technology, the public expectation of privacy, and the legal and political issues surrounding them. Privacy concerns exist wherever personally identifiable information or other sensitive information is collected and stored in digital form or otherwise. Improper or non-existent disclosure control can be the root cause for privacy issues."
            },
            bsoiaRelations: [{
                "type": "bsoia",
                "name": "Customer loyalty",
                "description": "Customer loyalty is all about attracting the right customer, getting them to buy, buy often, buy in higher quantities and bring you even more customers."
            }]
        };

        AssetsService.addTOIA(toiaToAdd);
        var oldAsset = AssetsService.getTOIA()[0];
        AssetsService.updateTOIAbyName(toiaToAdd.name, toiaToUpdate);
        var newAsset = AssetsService.getTOIA()[0];
        expect(oldAsset.bsoiaRelations.length).toEqual(0);
        expect(newAsset.bsoiaRelations.length).toEqual(1);

        expect(AssetsService.existsBSOIAinTOIA(toiaToUpdate.bsoiaRelations[0].name, toiaToUpdate.asset.name)).toBe(true);

    });

    it('should correctly remove a BSOIA relation from a TOIA asset', function(){

        var toiaToAdd = {
            "type": "toia",
            "name": "Data privacy",
            "description": "Data Privacy (or data protection), is the relationship between collection and dissemination of data, technology, the public expectation of privacy, and the legal and political issues surrounding them. Privacy concerns exist wherever personally identifiable information or other sensitive information is collected and stored in digital form or otherwise. Improper or non-existent disclosure control can be the root cause for privacy issues."
        };

        var toiaToUpdate = {
            asset: {
                "type": "toia",
                "name": "Data privacy",
                "description": "Data Privacy (or data protection), is the relationship between collection and dissemination of data, technology, the public expectation of privacy, and the legal and political issues surrounding them. Privacy concerns exist wherever personally identifiable information or other sensitive information is collected and stored in digital form or otherwise. Improper or non-existent disclosure control can be the root cause for privacy issues."
            },
            bsoiaRelations: [{
                "type": "bsoia",
                "name": "Customer loyalty",
                "description": "Customer loyalty is all about attracting the right customer, getting them to buy, buy often, buy in higher quantities and bring you even more customers."
            }]
        };

        AssetsService.addTOIA(toiaToAdd);
        AssetsService.updateTOIAbyName(toiaToAdd.name, toiaToUpdate);
        expect(AssetsService.getTOIA()[0].bsoiaRelations.length).toEqual(1);
        AssetsService.removeBSOIAfromTOIA(toiaToUpdate.bsoiaRelations[0].name, toiaToUpdate.asset.name);
        expect(AssetsService.getTOIA()[0].bsoiaRelations.length).toEqual(0);

    });

    it('should correctly check whether a certain BSOIA asset is linked to some TOIA asset, whatever it is', function(){

        var toiaToAdd1 = {
            "type": "toia",
            "name": "Data privacy",
            "description": "Data Privacy (or data protection), is the relationship between collection and dissemination of data, technology, the public expectation of privacy, and the legal and political issues surrounding them. Privacy concerns exist wherever personally identifiable information or other sensitive information is collected and stored in digital form or otherwise. Improper or non-existent disclosure control can be the root cause for privacy issues."
        };

        var toiaToAdd2 = {
            "type": "toia",
            "name": "Data integrity",
            "description": "Data integrity refers to maintaining and assuring the accuracy and consistency of data over its entire life-cycle, and is a critical aspect to the design, implementation and usage of any system which stores, processes, or retrieves data. The term data integrity is broad in scope and may have widely different meanings depending on the specific context even under the same general umbrella of computing. This article provides only a broad overview of some of the different types and concerns of data integrity."
        };

        var bsoia = {
            "type": "bsoia",
            "name": "Customer loyalty",
            "description": "Customer loyalty is all about attracting the right customer, getting them to buy, buy often, buy in higher quantities and bring you even more customers."
        };

        var toiaToUpdate = {
            asset: {
                "type": "toia",
                "name": "Data privacy",
                "description": "Data Privacy (or data protection), is the relationship between collection and dissemination of data, technology, the public expectation of privacy, and the legal and political issues surrounding them. Privacy concerns exist wherever personally identifiable information or other sensitive information is collected and stored in digital form or otherwise. Improper or non-existent disclosure control can be the root cause for privacy issues."
            },
            bsoiaRelations: [bsoia]
        };

        AssetsService.addTOIA(toiaToAdd1);
        AssetsService.addTOIA(toiaToAdd2);
        expect(AssetsService.isBSOIALinked(bsoia.name)).toBe(false);
        AssetsService.updateTOIAbyName(toiaToAdd1.name, toiaToUpdate);
        expect(AssetsService.isBSOIALinked(bsoia.name)).toBe(true);

    });

});
