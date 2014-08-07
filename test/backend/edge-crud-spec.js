/**
 * Created by Jordi Aranda.
 * 05/08/14
 * <jordi.aranda@bsc.es>
 */

describe('Edges CRUD API', function(){

    //Clean the database before executing any test
    beforeEach(function(done){
        // Drop nodes collections
        baseAJAX('DELETE', API.DROP_NODES(), true, null, function(){
            // Drop edges collections
            baseAJAX('DELETE', API.DROP_EDGES(), true, null, function(){
                done();
            }, function(){
                expect(false).toBe(true);
                done();
            });
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    // It should offer no data since the database must be in a clean state
    beforeEach(function(done){
        baseAJAX('GET', API.GET_NODES('metric'), true, null, function(data){
            expect(data.length).toEqual(0);
            baseAJAX('GET', API.GET_NODES('provider'), true, null, function(data){
                expect(data.length).toEqual(0);
                baseAJAX('GET', API.GET_NODES('service'), true, null, function(data){
                    expect(data.length).toEqual(0);
                    baseAJAX('GET', API.GET_NODES('characteristic'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        baseAJAX('GET', API.GET_NODES('bsoia'), true, null, function(data){
                            expect(data.length).toEqual(0);
                            baseAJAX('GET', API.GET_NODES('toia'), true, null, function(data){
                                expect(data.length).toEqual(0);
                                baseAJAX('GET', API.GET_NODES('risk'), true, null, function(data){
                                    expect(data.length).toEqual(0);
                                    baseAJAX('GET', API.GET_NODES('treatment'), true, null, function(data){
                                        expect(data.length).toEqual(0);
                                        done();
                                    }, function(jqXHR, textStatus, errorThrown){
                                        console.debug(errorThrown);
                                        expect(false).toBe(true);
                                        done();
                                    });
                                }, function(jqXHR, textStatus, errorThrown){
                                    console.debug(errorThrown);
                                    expect(false).toBe(true);
                                    done();
                                });
                            }, function(jqXHR, textStatus, errorThrown){
                                console.debug(errorThrown);
                                expect(false).toBe(true);
                                done();
                            });
                        }, function(jqXHR, textStatus, errorThrown){
                            console.debug(errorThrown);
                            expect(false).toBe(true);
                            done();
                        });
                    }, function(jqXHR, textStatus, errorThrown){
                        console.debug(errorThrown);
                        expect(false).toBe(true);
                        done();
                    });
                }, function(jqXHR, textStatus, errorThrown){
                    console.debug(errorThrown);
                    expect(false).toBe(true);
                    done();
                });
            }, function(jqXHR, textStatus, errorThrown){
                console.debug(errorThrown);
                expect(false).toBe(true);
                done();
            });
        }, function(jqXHR, textStatus, errorThrown){
            console.debug(errorThrown);
            expect(false).toBe(true);
            done();
        });
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
            "level": "1",
            "formula": ["a,b", "return a*b"]
        },
        {
            "name": "Agility",
            "type": "characteristic",
            "source": "SMI",
            "level": "1",
            "formula": ["a,b", "return a*b"]
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
        {
            "name": "Flexiant",
            "type": "service",
            "cloudType": "IaaS"
        }
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
    ];

    var edges = [
        {
            type: 'bsoia_toia',
            data: {
                value: 0
            }
        },
        {
            type: 'bsoia_toia',
            data: {
                value: 0
            }
        },
        {
            type: 'bsoia_risk',
            data: {
                value: 0
            }
        }
    ];

    /*******************************************************************************************
     ************************************* EDGES TESTS *****************************************
     *******************************************************************************************/

    it('should be able to create a new edge between different node types', function(done){
        var bsoiaId = null;
        var toiaId = null;
        // Create a new BSOIA asset
        baseAJAX('POST', API.POST_NODES(), true, bsoias[0], function(data){
            bsoiaId = data[0].attributes._id;
            // Create a new TOIA asset
            baseAJAX('POST', API.POST_NODES(), true, toias[0], function(data){
                toiaId = data[0].attributes._id;
                // Create the edge
                baseAJAX('POST', API.POST_EDGES(bsoiaId, toiaId), true, {type: 'bsoia_toia', data: {value: 1}}, function(){
                    baseAJAX('GET', API.GET_EDGES(), true, null, function(data){
                        expect(data.length).toEqual(1);
                        expect(data[0]._from).toBe(bsoiaId);
                        expect(data[0]._to).toBe(toiaId);
                        done();
                    });
                }, function(){
                    expect(false).toBe(true);
                    done();
                });
            }, function(){
                expect(false).toBe(true);
                done();
            });
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should not be able to create duplicate edges between different node types', function(done){
        var bsoiaId = null;
        var toiaId = null;
        // Create a new BSOIA asset
        baseAJAX('POST', API.POST_NODES(), true, bsoias[0], function(data){
            bsoiaId = data[0].attributes._id;
            // Create a new TOIA asset
            baseAJAX('POST', API.POST_NODES(), true, toias[0], function(data){
                toiaId = data[0].attributes._id;
                // Create the edge
                baseAJAX('POST', API.POST_EDGES(bsoiaId, toiaId), true, {type: 'bsoia_toia', data: {value: 1}}, function(){
                    baseAJAX('GET', API.GET_EDGES(), true, null, function(data){
                        expect(data.length).toEqual(1);
                        expect(data[0]._from).toBe(bsoiaId);
                        expect(data[0]._to).toBe(toiaId);
                    });
                    // Try to create a duplicate
                    baseAJAX('POST', API.POST_EDGES(bsoiaId, toiaId), true, {type: 'bsoia_toia', data: {value: 1}}, function(data){
                        baseAJAX('GET', API.GET_EDGES(), true, null, function(data){
                            expect(data.length).toEqual(1);
                            expect(data[0]._from).toBe(bsoiaId);
                            expect(data[0]._to).toBe(toiaId);
                            done();
                        });
                    }, function(){
                        expect(false).toBe(true);
                        done();
                    });
                }, function(){
                    expect(false).toBe(true);
                    done();
                });
            }, function(){
                expect(false).toBe(true);
                done();
            });
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a service with an existing provider and existing metrics', function(done){
        var provider = null;
        var metrices = null;
        // Create a new provider (1)
        baseAJAX('POST', API.POST_NODES(), true, providers[0], function(data){
            provider = data[0].attributes;
            // Create multiple metrices (2)
            baseAJAX('POST', API.POST_NODES(), true, metrics, function(data){
                metrices = data.map(function(metric){
                    return {name: metric.attributes.name, value: Math.floor(Math.random()*10)};
                });
                var metricesObject = {};
                _.each(metrices, function(metric){
                    metricesObject[metric.name] = metric.value
                });
                var service = {
                    name: 'Service A',
                    type: 'service',
                    cloudType: 'PaaS',
                    provider: provider,
                    metrics: metricesObject
                };
                baseAJAX('POST', API.POST_NODES(), true, service, function(){
                    baseAJAX('GET', API.GET_EDGES(), true, null, function(data){
                        // 1 edge to provider + 2 edges to metrices
                        expect(data.length).toEqual(3);
                        done();
                    })
                }, function(){
                    expect(false).toBe(true);
                    done();
                });
            }, function(){
                expect(false).toBe(true);
                done();
            });
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a characteristic with existing metrics', function(done){
        var metrices = null;
        // Create multiple metrices (2)
        baseAJAX('POST', API.POST_NODES(), true, metrics, function(data){
            metricesArray = data.map(function(metric){
                return metric.attributes.name;
            });
            var characteristic = {
                name: characteristics[0].name,
                type: characteristics[0].type,
                source: characteristics[0].source,
                level: characteristics[0].level,
                formula: "['a,b', 'return a + b']",
                metrics: metricesArray
            };
            baseAJAX('POST', API.POST_NODES(), true , characteristic, function(){
                baseAJAX('GET', API.GET_EDGES(), true, null, function(data){
                    // 2 edges to metrices
                    expect(data.length).toEqual(2);
                    done();
                }, function(){
                    expect(false).toBe(true);
                    done();
                });
            }, function(){
                expect(false).toBe(true);
                done();
            });
        });
    });

});
