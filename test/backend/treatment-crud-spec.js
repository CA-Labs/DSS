/**
 * Created by Jordi Aranda.
 * 05/08/14
 * <jordi.aranda@bsc.es>
 */

describe('Treatments CRUD API', function(){

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

});
