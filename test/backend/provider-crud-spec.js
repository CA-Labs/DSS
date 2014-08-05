/**
 * Created by Jordi Aranda.
 * 05/08/14
 * <jordi.aranda@bsc.es>
 */

describe('Providers CRUD API', function(){

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

});
