/**
 * Created by Jordi Aranda.
 * 05/08/14
 * <jordi.aranda@bsc.es>
 */

describe('Services CRUD API', function(){

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

    var services = [
        {
            "name": "Flexiant",
            "type": "service",
            "cloudType": "IaaS"
        }
    ];

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

});
