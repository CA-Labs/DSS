/**
 * Created by Jordi Aranda.
 * 05/08/14
 * <jordi.aranda@bsc.es>
 */
describe('BSOIA CRUD API', function(){
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

});
