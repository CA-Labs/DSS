/**
 * Created by Jordi Aranda.
 * 29/07/14
 * <jordi.aranda@bsc.es>
 */

describe('CRUD API', function(){

    // ArangoDB test database instance
    var ARANGODB_TEST_BASE_URL = 'http://localhost:8529/_db/test/dss/';

    // Crud API endpoints
    var API = {
        DROP_NODES: function(){
            return ARANGODB_TEST_BASE_URL + 'crud/nodes/all';
        },
        DROP_EDGES: function(){
            return ARANGODB_TEST_BASE_URL + 'crud/edges/all';
        },
        GET_NODES: function(type){
            return ARANGODB_TEST_BASE_URL + 'crud/nodes/' + type;
        },
        POST_NODES: function(){
            return ARANGODB_TEST_BASE_URL + 'crud/nodes';
        }
    };

    // Helper function for ajax calls
    var baseAJAX = function(type, url, async, data, success, error){
        $.ajax({
            type: type,
            url: url,
            async: async,
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'json',
            success: success,
            error: error
        });
    };

    //Clean the database before executing any test
    beforeEach(function(){
        // Drop nodes collections
        baseAJAX('DELETE', API.DROP_NODES(), false, null, null, null);
        // Drop edges collections
        baseAJAX('DELETE', API.DROP_EDGES(), false, null, null, null);
    });

    // Sample data (metrics, characteristics, providers, services,
    // bsoias, toias, risks, treatments) to populate the database

    var metrics = [
        {
            "name": "security_provider_certificates",
            "type": "metric",
            "options": {
                "0": "none",
                "5": "ISO 20000",
                "10": "ISO 27000, PCI"
            }
        },
        {
            "name": "place_of_jurisdiction",
            "type": "metric",
            "options": {
                "0": "unknown",
                "3": "outside Europe/USA",
                "6": "USA",
                "10": "Europe"
            }
        }
    ];

    var characteristics = [
        {
            "name": "Accountability",
            "type": "characteristic",
            "source": "SMI",
            "level": "1"
        },
        {
            "name": "Agility",
            "type": "characteristic",
            "source": "SMI",
            "level": "1"
        }
    ];

    var providers = [
        {
            "type": "provider",
            "name": "Flexiant",
            "year_founding": 2009,
            "website": "http://www.flexiant.com",
            "logo_url": "https://www.google.com/url?q=http%3A%2F%2Fwww.interxion.com%2FGlobal%2FHomepage%2FCustomer%2520Logos%2FFlexiant.png",
            "description": "Flexiant provides cloud orchestration software focused solely to the global service provider market.",
            "number_of_employees": 50,
            "headquarters": "Edinburgh, Scotland",
            "headquarters_country": "Scotland",
            "headquarters_continent": "Europe"
        },
        {
            "type": "provider",
            "name": "Insomer",
            "year_founding": 2013,
            "website": "http://www.insomer.com",
            "logo_url": "http://www.insomer.com/wp-content/uploads/2014/07/Rectangular-oscuro-big.png",
            "description": "En Insomer creemos que tener un proyecto es un fin en sí mismo, y este, el nuestro, nace precisamente con el objetivo de ayudar y colaborar con aquellos que tienen otros proyectos. Somos de esas personas convencidas de que el mundo se mejora emprendiendo, de que trabajar debería implicar disfrutar, de que las formalidades no sirven de mucho, y de que Jack y Rose cabían perfectamente en la tabla.",
            "number_of_employees": 3,
            "headquarters": "Rubi, Spain",
            "headquarters_country": "Spain",
            "headquarters_continent": "Europe"
        }
    ];

    var services = [
        // TODO:
    ];

    var bsoias = [
        {
            "type": "bsoia",
            "name": "Customer loyalty",
            "description": "Customer loyalty is all about attracting the right customer, getting them to buy, buy often, buy in higher quantities and bring you even more customers."
        },
        {
            "type": "bsoia",
            "name": "Legislation compliance",
            "description": "Legislation compliance describes the goal that organisations aspire to achieve in their efforts to ensure that they are aware of and take steps to comply with relevant laws and regulations"
        }
    ];

    var toias = [
        {
            "type": "toia",
            "name": "Data privacy",
            "description": "Data Privacy (or data protection), is the relationship between collection and dissemination of data, technology, the public expectation of privacy, and the legal and political issues surrounding them. Privacy concerns exist wherever personally identifiable information or other sensitive information is collected and stored in digital form or otherwise. Improper or non-existent disclosure control can be the root cause for privacy issues."
        },
        {
            "type": "toia",
            "name": "Data integrity",
            "description": "Data integrity refers to maintaining and assuring the accuracy and consistency of data over its entire life-cycle, and is a critical aspect to the design, implementation and usage of any system which stores, processes, or retrieves data. The term data integrity is broad in scope and may have widely different meanings depending on the specific context even under the same general umbrella of computing. This article provides only a broad overview of some of the different types and concerns of data integrity."
        }
    ];

    var risks = [
        {
            "type": "risk",
            "representation": "slider",
            "name": "Insufficient isolation",
            "attributes": "range: [0,10], step: 1, start: 0"
        },
        {
            "type": "risk",
            "representation": "slider",
            "name": "Unauthorized access from IaaS provider",
            "attributes": "range: [0,10], step: 1, start: 0"
        }
    ];

    var treatments = [
        {
            "representation": "select",
            "name": "Backup service",
            "type": "treatment",
            "options": "0: 'none', 5: 'available on block storage layer', 8: 'available on file system layer', 10: 'available on application, file system and storage layer'"
        },
        {
            "representation": "select",
            "name": "Place of jurisdiction",
            "type": "treatment",
            "options": "3:'Outside Europe/USA', 6:'USA', 10:'Europe'"
        }
    ]


    it('should offer no available data since the database is empty', function(){

        // Generic success callback, expect result to be empty always
        var success = function(data){
            expect(data.length).toEqual(0);
        };

        baseAJAX('GET', API.GET_NODES('metric'), false, null, success, function(){
            expect(false).toBe(true);
        });

        baseAJAX('GET', API.GET_NODES('provider'), false, null, success, function(){
            expect(false).toBe(true);
        });

        baseAJAX('GET', API.GET_NODES('service'), false, null, success, function(){
            expect(false).toBe(true);
        });

        baseAJAX('GET', API.GET_NODES('characteristic'), false, null, success, function(){
            expect(false).toBe(true);
        });

        baseAJAX('GET', API.GET_NODES('bsoia'), false, null, success, function(){
            expect(false).toBe(true);
        });

        baseAJAX('GET', API.GET_NODES('toia'), false, null, success, function(){
            expect(false).toBe(true);
        });

        baseAJAX('GET', API.GET_NODES('risk'), false, null, success, function(){
            expect(false).toBe(true);
        });

        baseAJAX('GET', API.GET_NODES('treatment'), false, null, success, function(){
            expect(false).toBe(true);
        });

    });

    it('should be able to create a new metric', function(){
        baseAJAX('POST', API.POST_NODES('metric'), false, metrics[0], function(){
            baseAJAX('GET', API.GET_NODES('metric'), false, null, function(data){
                expect(data.length).toEqual(1);
            });
        }, function(jqXHR, textStatus, errorThrown){
            console.log(errorThrown);
            expect(false).toBe(true);
        });
    });

    it('should be able to create a bulk of metrics', function(){
        baseAJAX('POST', API.POST_NODES('metric'), false, metrics, function(){
            baseAJAX('GET', API.GET_NODES('metric'), false, null, function(data){
                expect(data.length).toEqual(2);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should not be able to create an empty list of metrics', function(){
        baseAJAX('POST', API.POST_NODES('metric'), false, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('metric'), false, null, function(data){
                expect(data.length).toEqual(0);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should be able to create a new provider', function(){
        baseAJAX('POST', API.POST_NODES('provider'), false, providers[0], function(){
            baseAJAX('GET', API.GET_NODES('provider'), false, null, function(data){
                expect(data.length).toEqual(1);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should be able to create a bulk of providers', function(){
        baseAJAX('POST', API.POST_NODES('provider'), false, providers, function(){
            baseAJAX('GET', API.GET_NODES('provider'), false, null, function(data){
                expect(data.length).toEqual(2);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should not be able to create an empty list of providers', function(){
        baseAJAX('POST', API.POST_NODES('provider'), false, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('provider'), false, null, function(data){
                expect(data.length).toEqual(0);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    xit('should be able to create a new service', function(){
        // TODO: Pending spec
        expect(false).toBe(true);
    });

    it('should be able to create a new characteristic', function(){
        baseAJAX('POST', API.POST_NODES('provider'), false, providers[0], function(){
            baseAJAX('GET', API.GET_NODES('provider'), false, null, function(data){
                expect(data.length).toEqual(1);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should be able to create a bulk of characteristics', function(){
        baseAJAX('POST', API.POST_NODES('provider'), false, providers, function(){
            baseAJAX('GET', API.GET_NODES('provider'), false, null, function(data){
                expect(data.length).toEqual(2);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should not be able to create an empty list of characteristics', function(){
        baseAJAX('POST', API.POST_NODES('provider'), false, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('provider'), false, null, function(data){
                expect(data.length).toEqual(0);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should be able to create a new BSOIA asset', function(){
        baseAJAX('POST', API.POST_NODES(), false, bsoias[0], function(){
            baseAJAX('GET', API.GET_NODES('bsoia'), false, null, function(data){
                expect(data.length).toEqual(1);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should be able to create a bulk of BSOIA assets', function(){
        baseAJAX('POST', API.POST_NODES(), false, bsoias, function(){
            baseAJAX('GET', API.GET_NODES('bsoia'), false, null, function(data){
                expect(data.length).toEqual(2);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should not be able to create an empty list of BSOIA assets', function(){
        baseAJAX('POST', API.POST_NODES(), false, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('bsoia'), false, null, function(data){
                expect(data.length).toEqual(0);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should be able to create a new TOIA asset', function(){
        baseAJAX('POST', API.POST_NODES(), false, toias[0], function(){
            baseAJAX('GET', API.GET_NODES('toia'), false, null, function(data){
                expect(data.length).toEqual(1);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should be able to create a bulk of TOIA assets', function(){
        baseAJAX('POST', API.POST_NODES(), false, toias, function(){
            baseAJAX('GET', API.GET_NODES('toia'), false, null, function(data){
                expect(data.length).toEqual(2);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should not be able to create an empty list of TOIA assets', function(){
        baseAJAX('POST', API.POST_NODES(), false, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('toia'), false, null, function(data){
                expect(data.length).toEqual(0);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should be able to create a new risk', function(){
        baseAJAX('POST', API.POST_NODES(), false, risks[0], function(){
            baseAJAX('GET', API.GET_NODES('risk'), false, null, function(data){
                expect(data.length).toEqual(1);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should be able to create a bulk of risks', function(){
        baseAJAX('POST', API.POST_NODES(), false, risks, function(){
            baseAJAX('GET', API.GET_NODES('risk'), false, null, function(data){
                expect(data.length).toEqual(2);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should not be able to create an empty list of risks', function(){
        baseAJAX('POST', API.POST_NODES(), false, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('risk'), false, null, function(data){
                expect(data.length).toEqual(0);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should be able to create a new treatment', function(){
        baseAJAX('POST', API.POST_NODES(), false, treatments[0], function(){
            baseAJAX('GET', API.GET_NODES('treatment'), false, null, function(data){
                expect(data.length).toEqual(1);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should be able to create a bulk of treatments', function(){
        baseAJAX('POST', API.POST_NODES(), false, treatments, function(){
            baseAJAX('GET', API.GET_NODES('treatment'), false, null, function(data){
                expect(data.length).toEqual(2);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

    it('should not be able to create an empty list of treatments', function(){
        baseAJAX('POST', API.POST_NODES(), false, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('treatment'), false, null, function(data){
                expect(data.length).toEqual(0);
            });
        }, function(jqXHR, textStatus, errorThrown){
            expect(false).toBe(true);
        });
    });

});
