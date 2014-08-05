/**
 * Created by Jordi Aranda.
 * 05/08/14
 * <jordi.aranda@bsc.es>
 */

describe('Metrics CRUD API', function(){

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

});
