/**
 * Created by Jordi Aranda.
 * 05/08/14
 * <jordi.aranda@bsc.es>
 */

describe('TOIA CRUD API', function(){

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

});
