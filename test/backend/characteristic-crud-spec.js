/**
 * Created by Jordi Aranda.
 * 05/08/14
 * <jordi.aranda@bsc.es>
 */

describe('Characteristics CRUD API', function(){

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

});
