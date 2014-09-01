/**
 * Created by Jordi Aranda.
 * 28/07/14
 * <jordi.aranda@bsc.es>
 */

describe('ArangoDBService - Check API methods', function(){

    var dssApp, ArangoDBService, $httpBackend;
    var ARANGODB_TEST_BASE_URL = 'http://localhost:8529/_db/test/dss/';

    // Load the dssApp, which contains the whole application
    beforeEach(module('dssApp'));

    // Load required services
    beforeEach(inject(function(_ArangoDBService_, _$httpBackend_){

        ArangoDBService = _ArangoDBService_;
        // Overwrite ARANGODB_BASE_URL to point out the test database
        ArangoDBService.ARANGODB_BASE_URL = ARANGODB_TEST_BASE_URL;

        $httpBackend = _$httpBackend_;

    }));

    it('should have getBSOIA function', function() {
        expect((ArangoDBService.getBSOIA).toBeFunction);
    });

    it('should have getTOIA function', function(){
        expect((ArangoDBService.getTOIA).toBeFunction);
    });

    it('should have getRisks function', function(){
        expect((ArangoDBService.getRisks).toBeFunction);
    });

    it('should have getTreatments function', function(){
        expect((ArangoDBService.getTreatments).toBeFunction);
    })

    it('should have getPotentialRisks function', function(){
        expect((ArangoDBService.getPotentialRisks).toBeFunction);
    });

    it('should have getPotentialTreatments function', function(){
        expect((ArangoDBService.getPotentialTreatments).toBeFunction);
    });

});

describe('ArangoDBService - Check API calls', function(){

    var dssApp, ArangoDBService, AssetsService, $httpBackend;
    var ARANGODB_TEST_BASE_URL = 'http://localhost:8529/_db/test/dss/';

    // Load the dssApp, which contains the whole application
    beforeEach(module('dssApp'));

    // Load required services
    beforeEach(inject(function(_ArangoDBService_, _AssetsService_, _$httpBackend_){

        ArangoDBService = _ArangoDBService_;
        // Overwrite ARANGODB_BASE_URL to point out the test database
        ArangoDBService.ARANGODB_BASE_URL = ARANGODB_TEST_BASE_URL;

        $httpBackend = _$httpBackend_;

    }));

    it('should point out to the test database', function(){
        expect(ArangoDBService.ARANGODB_BASE_URL).toBe(ARANGODB_TEST_BASE_URL);
    });

    it('should retrieve some BSOIA assets', function(){

        $httpBackend.expect('GET', ARANGODB_TEST_BASE_URL + 'crud/nodes/bsoia').respond('200', [{}, {}, {}]);

        ArangoDBService.getBSOIA(function(error, data){
            expect(data).not.toBe(null);
            expect(data.length).toBe(3);
        });

        $httpBackend.flush();

    });

    it('should retrieve some TOIA assets', function(){

        $httpBackend.expect('GET', ARANGODB_TEST_BASE_URL + 'crud/nodes/toia').respond('200', [{}, {}, {}]);

        ArangoDBService.getTOIA(function(error, data){
            expect(data).not.toBe(null);
            expect(data.length).toBe(3);
        });

        $httpBackend.flush();

    });

    it('should retrieve some risks', function(){

        $httpBackend.expect('GET', ARANGODB_TEST_BASE_URL + 'crud/nodes/risk').respond('200', [{}, {}, {}]);

        ArangoDBService.getRisks(function(error, data){
            expect(data).not.toBe(null);
            expect(data.length).toBe(3);
        });

        $httpBackend.flush();

    });

    it('should retrieve some treatments', function(){

        $httpBackend.expect('GET', ARANGODB_TEST_BASE_URL + 'crud/nodes/treatment').respond('200', [{}, {}, {}]);

        ArangoDBService.getTreatments(function(error, data){
            expect(data).not.toBe(null);
            expect(data.length).toBe(3);
        });

        $httpBackend.flush();

    });

    it('should retrieve some potential risks', function(){

        $httpBackend.expect('GET', ARANGODB_TEST_BASE_URL + 'graph/potentialRisks?').respond('200', [{}, {}, {}]);

        ArangoDBService.getPotentialRisks([], [], function(error, data){
            expect(data).not.toBe(null);
            expect(data.length).toBe(3);
        });

        $httpBackend.flush();

    });

    it('should retrieve some potential treatments', function(){

        $httpBackend.expect('GET', ARANGODB_TEST_BASE_URL + 'graph/potentialTreatments?').respond('200', [{}, {}, {}]);

        ArangoDBService.getPotentialTreatments([], function(error, data){
            expect(data).not.toBe(null);
            expect(data.length).toBe(3);
        });

        $httpBackend.flush();

    });

});
