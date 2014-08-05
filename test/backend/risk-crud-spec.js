/**
 * Created by Jordi Aranda.
 * 05/08/14
 * <jordi.aranda@bsc.es>
 */

describe('Risks CRUD API', function(){

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

});
