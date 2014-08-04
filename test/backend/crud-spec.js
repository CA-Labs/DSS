/**
 * Created by Jordi Aranda.
 * 29/07/14
 * <jordi.aranda@bsc.es>
 */

jasmine.DEFAULT_TIMEOUT_INTERVAL=15000;

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
        GET_NODE_BY_ID: function(_id){
            return ARANGODB_TEST_BASE_URL + 'crud/nodes/' + _id;
        },
        UPDATE_NODE_BY_ID: function(_id){
            return ARANGODB_TEST_BASE_URL + 'crud/nodes/' + _id;
        },
        DELETE_NODE_BY_ID: function(_id){
            return ARANGODB_TEST_BASE_URL + 'crud/nodes/' + _id;
        },
        POST_NODES: function(){
            return ARANGODB_TEST_BASE_URL + 'crud/nodes';
        },
        DELETE_NODES: function(type){
            return ARANGODB_TEST_BASE_URL + 'crud/nodes/' + type;
        },
        GET_EDGES: function(){
            return ARANGODB_TEST_BASE_URL + 'crud/edges'
        },
        POST_EDGES: function(_from, _to){
            return ARANGODB_TEST_BASE_URL + 'crud/edges/' + _from + '/' + _to;
        }
    };

    // Helper function for ajax calls
    var baseAJAX = function(type, url, async, data, success, error){
        //console.debug('type', type);
        //console.debug('url', url);
        //console.debug(data);
        $.ajax({
            type: type,
            url: url,
            async: true,
            data: data ? JSON.stringify(data) : null,
            dataType: 'json',
            contentType: 'json',
            success: success,
            error: error
        });
    };

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
     ************************************ METRIC TESTS *****************************************
     *******************************************************************************************/

    it('should be able to create a new metric', function(done){
        baseAJAX('POST', API.POST_NODES(), true, metrics[0], function(){
            baseAJAX('GET', API.GET_NODES('metric'), true, null, function(data){
                expect(data.length).toEqual(1);
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

    it('should not be able to create an invalid new metric', function(done){
        var wrongMetric = $.extend(true, {}, metrics[0]);
        wrongMetric.type = 'wrongMetric';
        baseAJAX('POST', API.POST_NODES(), true, wrongMetric, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Model validation failed');
            done();
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should not be able to retrieve a non existing metric', function(done){
        baseAJAX('GET', API.GET_NODE_BY_ID('metric/-1'), true, null, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Document -1 not found');
            done();
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new metric and retrieve it back by id', function(done){
        baseAJAX('POST', API.POST_NODES(), true, metrics[0], function(){
            baseAJAX('GET', API.GET_NODES('metric'), true, null, function(data){
                expect(data.length).toEqual(1);
                var metricId = data[0]._id;
                baseAJAX('GET', API.GET_NODE_BY_ID(metricId), true, null, function(data){
                    expect(data).toBeTruthy();
                    expect(data.type).toMatch('metric');
                    done();
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

    it('should be able to create a new metric and update it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, metrics[0], function(){
            baseAJAX('GET', API.GET_NODES('metric'), true, null, function(data){
                expect(data.length).toEqual(1);
                var metricId = data[0]._id;
                //Update some field
                var metricModelRetrieved = data[0];
                metricModelRetrieved.name = metricModelRetrieved.name.toUpperCase();
                baseAJAX('PUT', API.UPDATE_NODE_BY_ID(metricId), true, metricModelRetrieved, function(data){
                    expect(data).toBeTruthy();
                    expect(data.name).toBe(metrics[0].name.toUpperCase());
                    done();
                }, function(){
                    expect(false).toBe(true);
                    done();
                });
            }, function(){
                expect(false).toBe(true);
                done();
            })
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new metric and delete it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, metrics[0], function(){
            baseAJAX('GET', API.GET_NODES('metric'), true, null, function(data){
                expect(data.length).toEqual(1);
                var metricId = data[0]._id;
                baseAJAX('DELETE', API.DELETE_NODE_BY_ID(metricId), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('metric'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to delete metrics', function(done){
        baseAJAX('POST', API.POST_NODES(), true, metrics, function(){
            baseAJAX('GET', API.GET_NODES('metric'), true, null, function(data){
                expect(data.length).toEqual(2);
                baseAJAX('DELETE', API.DELETE_NODES('metric'), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('metric'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to create a bulk of metrics', function(done){
        baseAJAX('POST', API.POST_NODES(), true, metrics, function(){
            baseAJAX('GET', API.GET_NODES('metric'), true, null, function(data){
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

    it('should not be able to create an empty list of metrics', function(done){
        baseAJAX('POST', API.POST_NODES(), true, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('metric'), true, null, function(data){
                expect(data.length).toEqual(0);
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

    /*******************************************************************************************
     ************************************ PROVIDER TESTS ***************************************
     *******************************************************************************************/

    it('should be able to create a new provider', function(done){
        baseAJAX('POST', API.POST_NODES(), true, providers[0], function(){
            baseAJAX('GET', API.GET_NODES('provider'), true, null, function(data){
                expect(data.length).toEqual(1);
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

    it('should not be able to create an invalid new provider', function(done){
        var wrongProvider = $.extend(true, {}, providers[0]);
        wrongProvider.type = 'wrongProvider';
        baseAJAX('POST', API.POST_NODES(), true, wrongProvider, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Model validation failed');
            done();
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should not be able to retrieve a non existing provider', function(done){
        baseAJAX('GET', API.GET_NODE_BY_ID('provider/-1'), true, null, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Document -1 not found');
            done()
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new provider and retrieve it back by id', function(done){
        baseAJAX('POST', API.POST_NODES(), true, providers[0], function(){
            baseAJAX('GET', API.GET_NODES('provider'), true, null, function(data){
                expect(data.length).toEqual(1);
                var providerId = data[0]._id;
                baseAJAX('GET', API.GET_NODE_BY_ID(providerId), true, null, function(data){
                    expect(data).toBeTruthy();
                    expect(data.type).toMatch('provider');
                    done();
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

    it('should be able to create a new provider and update it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, providers[0], function(){
            baseAJAX('GET', API.GET_NODES('provider'), true, null, function(data){
                expect(data.length).toEqual(1);
                var providerId = data[0]._id;
                //Update some field
                var providerModelRetrieved = data[0];
                providerModelRetrieved.name = providerModelRetrieved.name.toUpperCase();
                baseAJAX('PUT', API.UPDATE_NODE_BY_ID(providerId), true, providerModelRetrieved, function(data){
                    expect(data).toBeTruthy();
                    expect(data.name).toBe(providers[0].name.toUpperCase());
                    done();
                }, function(){
                    expect(false).toBe(true);
                    done();
                });
            }, function(){
                expect(false).toBe(true);
                done();
            })
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new provider and delete it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, providers[0], function(){
            baseAJAX('GET', API.GET_NODES('provider'), true, null, function(data){
                expect(data.length).toEqual(1);
                var providerId = data[0]._id;
                baseAJAX('DELETE', API.DELETE_NODE_BY_ID(providerId), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('provider'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to delete providers', function(done){
        baseAJAX('POST', API.POST_NODES(), true, providers, function(){
            baseAJAX('GET', API.GET_NODES('provider'), true, null, function(data){
                expect(data.length).toEqual(2);
                baseAJAX('DELETE', API.DELETE_NODES('provider'), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('provider'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to create a bulk of providers', function(done){
        baseAJAX('POST', API.POST_NODES(), true, providers, function(){
            baseAJAX('GET', API.GET_NODES('provider'), true, null, function(data){
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

    it('should not be able to create an empty list of providers', function(done){
        baseAJAX('POST', API.POST_NODES(), true, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('provider'), true, null, function(data){
                expect(data.length).toEqual(0);
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

    /*******************************************************************************************
     ************************************* SERVICE TESTS ***************************************
     *******************************************************************************************/

    it('should be able to create a new service', function(done){
        baseAJAX('POST', API.POST_NODES(), true, services[0], function(data){
            baseAJAX('GET', API.GET_NODES('service'), true, null, function(data){
                expect(data.length).toEqual(1);
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

    it('should not be able to create an invalid service', function(done){
        var wrongService = $.extend(true, {}, services[0]);
        wrongService.type = 'wrongService';
        baseAJAX('POST', API.POST_NODES(), true, wrongService, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Model validation failed');
            done()
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should not be able to retrieve a non existing service', function(done){
        baseAJAX('GET', API.GET_NODE_BY_ID('service/-1'), true, null, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Document -1 not found');
            done();
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new service and retrieve it back by id', function(done){
        baseAJAX('POST', API.POST_NODES(), true, services[0], function(){
            baseAJAX('GET', API.GET_NODES('service'), true, null, function(data){
                expect(data.length).toEqual(1);
                var serviceId = data[0]._id;
                baseAJAX('GET', API.GET_NODE_BY_ID(serviceId), true, null, function(data){
                    expect(data).toBeTruthy();
                    expect(data.type).toMatch('service');
                    done();
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

    it('should be able to create a new service and update it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, services[0], function(){
            baseAJAX('GET', API.GET_NODES('service'), true, null, function(data){
                expect(data.length).toEqual(1);
                var serviceId = data[0]._id;
                //Update some field
                var serviceModelRetrieved = data[0];
                serviceModelRetrieved.name = serviceModelRetrieved.name.toUpperCase();
                baseAJAX('PUT', API.UPDATE_NODE_BY_ID(serviceId), true, serviceModelRetrieved, function(data){
                    expect(data).toBeTruthy();
                    expect(data.name).toBe(services[0].name.toUpperCase());
                    done();
                }, function(){
                    expect(false).toBe(true);
                    done();
                });
            }, function(){
                expect(false).toBe(true);
                done();
            })
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new service and delete it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, services[0], function(){
            baseAJAX('GET', API.GET_NODES('service'), true, null, function(data){
                expect(data.length).toEqual(1);
                var serviceId = data[0]._id;
                baseAJAX('DELETE', API.DELETE_NODE_BY_ID(serviceId), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('service'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to delete services', function(done){
        baseAJAX('POST', API.POST_NODES(), true, services, function(){
            baseAJAX('GET', API.GET_NODES('service'), true, null, function(data){
                expect(data.length).toEqual(1);
                baseAJAX('DELETE', API.DELETE_NODES('service'), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('service'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to create a bulk of services', function(done){
        baseAJAX('POST', API.POST_NODES(), true, services, function(){
            baseAJAX('GET', API.GET_NODES('service'), true, null, function(data){
                expect(data.length).toEqual(1);
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

    it('should not be able to create an empty list of services', function(done){
        baseAJAX('POST', API.POST_NODES(), true, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('service'), true, null, function(data){
                expect(data.length).toEqual(0);
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

    /*******************************************************************************************
     ********************************** CHARACTERISTIC TESTS ***********************************
     *******************************************************************************************/

    it('should be able to create a new characteristic', function(done){
        baseAJAX('POST', API.POST_NODES(), true, characteristics[0], function(){
            baseAJAX('GET', API.GET_NODES('characteristic'), true, null, function(data){
                expect(data.length).toEqual(1);
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

    it('should not be able to create an invalid characteristic', function(done){
        var wrongCharacteristic = $.extend(true, {}, characteristics[0]);
        wrongCharacteristic.type = 'wrongCharacteristic';
        baseAJAX('POST', API.POST_NODES(), true, wrongCharacteristic, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Model validation failed');
            done()
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should not be able to retrieve a non existing characteristic', function(done){
        baseAJAX('GET', API.GET_NODE_BY_ID('characteristic/-1'), true, null, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Document -1 not found');
            done();
        }, function(){
            expect(fase).toBe(true);
            done();
        });
    });

    it('should be able to create a new characteristic and retrieve it back by id', function(done){
        baseAJAX('POST', API.POST_NODES(), true, characteristics[0], function(){
            baseAJAX('GET', API.GET_NODES('characteristic'), true, null, function(data){
                expect(data.length).toEqual(1);
                var characteristicId = data[0]._id;
                baseAJAX('GET', API.GET_NODE_BY_ID(characteristicId), true, null, function(data){
                    expect(data).toBeTruthy();
                    expect(data.type).toMatch('characteristic');
                    done();
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

    it('should be able to create a new characteristic and update it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, characteristics[0], function(){
            baseAJAX('GET', API.GET_NODES('characteristic'), true, null, function(data){
                expect(data.length).toEqual(1);
                var characteristicId = data[0]._id;
                //Update some field
                var characteristicModelRetrieved = data[0];
                characteristicModelRetrieved.name = characteristicModelRetrieved.name.toUpperCase();
                baseAJAX('PUT', API.UPDATE_NODE_BY_ID(characteristicId), true, characteristicModelRetrieved, function(data){
                    expect(data).toBeTruthy();
                    expect(data.name).toBe(characteristics[0].name.toUpperCase());
                    done();
                }, function(){
                    expect(false).toBe(true);
                    done();
                });
            }, function(){
                expect(false).toBe(true);
                done();
            })
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new characteristic and delete it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, characteristics[0], function(){
            baseAJAX('GET', API.GET_NODES('characteristic'), true, null, function(data){
                expect(data.length).toEqual(1);
                var characteristicId = data[0]._id;
                baseAJAX('DELETE', API.DELETE_NODE_BY_ID(characteristicId), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('characteristic'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to delete characteristics', function(done){
        baseAJAX('POST', API.POST_NODES(), true, characteristics, function(){
            baseAJAX('GET', API.GET_NODES('characteristic'), true, null, function(data){
                expect(data.length).toEqual(2);
                baseAJAX('DELETE', API.DELETE_NODES('characteristic'), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('characteristic'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to create a bulk of characteristics', function(done){
        baseAJAX('POST', API.POST_NODES(), true, characteristics, function(){
            baseAJAX('GET', API.GET_NODES('characteristic'), true, null, function(data){
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

    it('should not be able to create an empty list of characteristics', function(done){
        baseAJAX('POST', API.POST_NODES(), true, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('provider'), true, null, function(data){
                expect(data.length).toEqual(0);
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

    /*******************************************************************************************
     ************************************* BSOIA TESTS *****************************************
     *******************************************************************************************/

    it('should be able to create a new BSOIA asset', function(done){
        baseAJAX('POST', API.POST_NODES(), true, bsoias[0], function(){
            baseAJAX('GET', API.GET_NODES('bsoia'), true, null, function(data){
                expect(data.length).toEqual(1);
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

    it('should not be able to create an invalid new BSOIA asset', function(done){
        var wrongBSOIA = $.extend(true, {}, bsoias[0]);
        wrongBSOIA.type = 'wrongBSOIA';
        baseAJAX('POST', API.POST_NODES(), true, wrongBSOIA, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Model validation failed');
            done();
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should not be able to retrieve a non existing BSOIA asset', function(done){
        baseAJAX('GET', API.GET_NODE_BY_ID('bsoia/-1'), true, null, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Document -1 not found');
            done();
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new BSOIA asset and retrieve it back by id', function(done){
        baseAJAX('POST', API.POST_NODES(), true, bsoias[0], function(){
            baseAJAX('GET', API.GET_NODES('bsoia'), true, null, function(data){
                expect(data.length).toEqual(1);
                var bsoiaId = data[0]._id;
                baseAJAX('GET', API.GET_NODE_BY_ID(bsoiaId), true, null, function(data){
                    expect(data).toBeTruthy();
                    expect(data.type).toMatch('bsoia');
                    done();
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

    it('should be able to create a new BSOIA asset and update it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, bsoias[0], function(){
            baseAJAX('GET', API.GET_NODES('bsoia'), true, null, function(data){
                expect(data.length).toEqual(1);
                var bsoiaId = data[0]._id;
                //Update some field
                var bsoiaModelRetrieved = data[0];
                bsoiaModelRetrieved.name = bsoiaModelRetrieved.name.toUpperCase();
                baseAJAX('PUT', API.UPDATE_NODE_BY_ID(bsoiaId), true, bsoiaModelRetrieved, function(data){
                    expect(data).toBeTruthy();
                    expect(data.name).toBe(bsoias[0].name.toUpperCase());
                    done();
                }, function(){
                    expect(false).toBe(true);
                    done();
                });
            }, function(){
                expect(false).toBe(true);
                done();
            })
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new BSOIA asset and delete it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, bsoias[0], function(){
            baseAJAX('GET', API.GET_NODES('bsoia'), true, null, function(data){
                expect(data.length).toEqual(1);
                var bsoiaId = data[0]._id;
                baseAJAX('DELETE', API.DELETE_NODE_BY_ID(bsoiaId), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('bsoia'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to delete BSOIA assets', function(done){
        baseAJAX('POST', API.POST_NODES(), true, bsoias, function(){
            baseAJAX('GET', API.GET_NODES('bsoia'), true, null, function(data){
                expect(data.length).toEqual(2);
                baseAJAX('DELETE', API.DELETE_NODES('bsoia'), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('bsoia'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to create a bulk of BSOIA assets', function(done){
        baseAJAX('POST', API.POST_NODES(), true, bsoias, function(){
            baseAJAX('GET', API.GET_NODES('bsoia'), true, null, function(data){
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

    it('should not be able to create an empty list of BSOIA assets', function(done){
        baseAJAX('POST', API.POST_NODES(), true, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('bsoia'), true, null, function(data){
                expect(data.length).toEqual(0);
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

    /*******************************************************************************************
     ************************************** TOIA TESTS *****************************************
     *******************************************************************************************/

    it('should be able to create a new TOIA asset', function(done){
        baseAJAX('POST', API.POST_NODES(), true, toias[0], function(){
            baseAJAX('GET', API.GET_NODES('toia'), true, null, function(data){
                expect(data.length).toEqual(1);
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

    it('should not be able to create an invalid new TOIA asset', function(done){
        var wrongTOIA = $.extend(true, {}, toias[0]);
        wrongTOIA.type = 'wrongTOIA';
        baseAJAX('POST', API.POST_NODES(), true, wrongTOIA, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Model validation failed');
            done();
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should not be able to retrieve a non existing TOIA asset', function(done){
        baseAJAX('GET', API.GET_NODE_BY_ID('toia/-1'), true, null, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Document -1 not found');
            done();
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new TOIA asset and retrieve it back by id', function(done){
        baseAJAX('POST', API.POST_NODES(), true, toias[0], function(){
            baseAJAX('GET', API.GET_NODES('toia'), true, null, function(data){
                expect(data.length).toEqual(1);
                var toiaId = data[0]._id;
                baseAJAX('GET', API.GET_NODE_BY_ID(toiaId), true, null, function(data){
                    expect(data).toBeTruthy();
                    expect(data.type).toMatch('toia');
                    done();
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

    it('should be able to create a new TOIA asset and update it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, toias[0], function(){
            baseAJAX('GET', API.GET_NODES('toia'), true, null, function(data){
                expect(data.length).toEqual(1);
                var toiaId = data[0]._id;
                //Update some field
                var toiaModelRetrieved = data[0];
                toiaModelRetrieved.name = toiaModelRetrieved.name.toUpperCase();
                baseAJAX('PUT', API.UPDATE_NODE_BY_ID(toiaId), true, toiaModelRetrieved, function(data){
                    expect(data).toBeTruthy();
                    expect(data.name).toBe(toias[0].name.toUpperCase());
                    done();
                }, function(){
                    expect(false).toBe(true);
                    done();
                });
            }, function(){
                expect(false).toBe(true);
                done();
            })
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new TOIA asset and delete it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, toias[0], function(){
            baseAJAX('GET', API.GET_NODES('toia'), true, null, function(data){
                expect(data.length).toEqual(1);
                var toiaId = data[0]._id;
                baseAJAX('DELETE', API.DELETE_NODE_BY_ID(toiaId), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('toia'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to delete TOIA assets', function(done){
        baseAJAX('POST', API.POST_NODES(), true, toias, function(){
            baseAJAX('GET', API.GET_NODES('toia'), true, null, function(data){
                expect(data.length).toEqual(2);
                baseAJAX('DELETE', API.DELETE_NODES('toia'), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('toia'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to create a bulk of TOIA assets', function(done){
        baseAJAX('POST', API.POST_NODES(), true, toias, function(){
            baseAJAX('GET', API.GET_NODES('toia'), true, null, function(data){
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

    it('should not be able to create an empty list of TOIA assets', function(done){
        baseAJAX('POST', API.POST_NODES(), true, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('toia'), true, null, function(data){
                expect(data.length).toEqual(0);
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

    /*******************************************************************************************
     ************************************* RISKS TESTS *****************************************
     *******************************************************************************************/

    it('should be able to create a new risk', function(done){
        baseAJAX('POST', API.POST_NODES(), true, risks[0], function(){
            baseAJAX('GET', API.GET_NODES('risk'), true, null, function(data){
                expect(data.length).toEqual(1);
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

    it('should not be able to create an invalid new risk', function(done){
        var wrongRisk = $.extend(true, {}, risks[0]);
        wrongRisk.type = 'wrongRisk';
        baseAJAX('POST', API.POST_NODES(), true, wrongRisk, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Model validation failed');
            done();
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should not be able to retrieve a non existing risk', function(done){
        baseAJAX('GET', API.GET_NODE_BY_ID('risk/-1'), true, null, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Document -1 not found');
            done();
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new risk and retrieve it back by id', function(done){
        baseAJAX('POST', API.POST_NODES(), true, risks[0], function(){
            baseAJAX('GET', API.GET_NODES('risk'), true, null, function(data){
                expect(data.length).toEqual(1);
                var riskId = data[0]._id;
                baseAJAX('GET', API.GET_NODE_BY_ID(riskId), true, null, function(data){
                    expect(data).toBeTruthy();
                    expect(data.type).toMatch('risk');
                    done();
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

    it('should be able to create a new risk and update it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, risks[0], function(){
            baseAJAX('GET', API.GET_NODES('risk'), true, null, function(data){
                expect(data.length).toEqual(1);
                var riskId = data[0]._id;
                //Update some field
                var riskModelRetrieved = data[0];
                riskModelRetrieved.name = riskModelRetrieved.name.toUpperCase();
                baseAJAX('PUT', API.UPDATE_NODE_BY_ID(riskId), true, riskModelRetrieved, function(data){
                    expect(data).toBeTruthy();
                    expect(data.name).toBe(risks[0].name.toUpperCase());
                    done();
                }, function(){
                    expect(false).toBe(true);
                    done();
                });
            }, function(){
                expect(false).toBe(true);
                done();
            })
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new risk and delete it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, risks[0], function(){
            baseAJAX('GET', API.GET_NODES('risk'), true, null, function(data){
                expect(data.length).toEqual(1);
                var riskId = data[0]._id;
                baseAJAX('DELETE', API.DELETE_NODE_BY_ID(riskId), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('risk'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to delete risks', function(done){
        baseAJAX('POST', API.POST_NODES(), true, risks, function(){
            baseAJAX('GET', API.GET_NODES('risk'), true, null, function(data){
                expect(data.length).toEqual(2);
                baseAJAX('DELETE', API.DELETE_NODES('risk'), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('risk'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to create a bulk of risks', function(done){
        baseAJAX('POST', API.POST_NODES(), true, risks, function(){
            baseAJAX('GET', API.GET_NODES('risk'), true, null, function(data){
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

    it('should not be able to create an empty list of risks', function(done){
        baseAJAX('POST', API.POST_NODES(), true, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('risk'), true, null, function(data){
                expect(data.length).toEqual(0);
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

    /*******************************************************************************************
     *********************************** TREATMENTS TESTS **************************************
     *******************************************************************************************/

    it('should be able to create a new treatment', function(done){
        baseAJAX('POST', API.POST_NODES(), true, treatments[0], function(){
            baseAJAX('GET', API.GET_NODES('treatment'), true, null, function(data){
                expect(data.length).toEqual(1);
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

    it('should not be able to create an invalid new treatment', function(done){
        var wrongTreatment = $.extend(true, {}, treatments[0]);
        wrongTreatment.type = 'wrongTreatment';
        baseAJAX('POST', API.POST_NODES(), true, wrongTreatment, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Model validation failed');
            done();
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should not be able to retrieve a non existing treatment', function(done){
        baseAJAX('GET', API.GET_NODE_BY_ID('treatment/-1'), true, null, function(data){
            expect(data.error).toBe(true);
            expect(data.reason).toEqual('Document -1 not found');
            done();
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new treatment and retrieve it back by id', function(done){
        baseAJAX('POST', API.POST_NODES(), true, treatments[0], function(){
            baseAJAX('GET', API.GET_NODES('treatment'), true, null, function(data){
                expect(data.length).toEqual(1);
                var treatmentId = data[0]._id;
                baseAJAX('GET', API.GET_NODE_BY_ID(treatmentId), true, null, function(data){
                    expect(data).toBeTruthy();
                    expect(data.type).toMatch('treatment');
                    done();
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

    it('should be able to create a new treatment and update it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, treatments[0], function(){
            baseAJAX('GET', API.GET_NODES('treatment'), true, null, function(data){
                expect(data.length).toEqual(1);
                var treatmentId = data[0]._id;
                //Update some field
                var treatmentModelRetrieved = data[0];
                treatmentModelRetrieved.name = treatmentModelRetrieved.name.toUpperCase();
                baseAJAX('PUT', API.UPDATE_NODE_BY_ID(treatmentId), true, treatmentModelRetrieved, function(data){
                    expect(data).toBeTruthy();
                    expect(data.name).toBe(treatments[0].name.toUpperCase());
                    done();
                }, function(){
                    expect(false).toBe(true);
                    done();
                });
            }, function(){
                expect(false).toBe(true);
                done();
            })
        }, function(){
            expect(false).toBe(true);
            done();
        });
    });

    it('should be able to create a new treatment and delete it', function(done){
        baseAJAX('POST', API.POST_NODES(), true, treatments[0], function(){
            baseAJAX('GET', API.GET_NODES('treatment'), true, null, function(data){
                expect(data.length).toEqual(1);
                var treatmentId = data[0]._id;
                baseAJAX('DELETE', API.DELETE_NODE_BY_ID(treatmentId), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('treatment'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to delete treatments', function(done){
        baseAJAX('POST', API.POST_NODES(), true, treatments, function(){
            baseAJAX('GET', API.GET_NODES('treatment'), true, null, function(data){
                expect(data.length).toEqual(2);
                baseAJAX('DELETE', API.DELETE_NODES('treatment'), true, null, function(){
                    baseAJAX('GET', API.GET_NODES('treatment'), true, null, function(data){
                        expect(data.length).toEqual(0);
                        done();
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

    it('should be able to create a bulk of treatments', function(done){
        baseAJAX('POST', API.POST_NODES(), true, treatments, function(){
            baseAJAX('GET', API.GET_NODES('treatment'), true, null, function(data){
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

    it('should not be able to create an empty list of treatments', function(done){
        baseAJAX('POST', API.POST_NODES(), true, [], function(data){
            expect(data.error).toBe(true);
            baseAJAX('GET', API.GET_NODES('treatment'), true, null, function(data){
                expect(data.length).toEqual(0);
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
                formula: ['a,b', 'return a + b'],
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
