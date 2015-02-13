var arango, db, jobs = [],
    storedJobs = {};
var port;
try {
    arango = require('arangojs')
} catch (e) {
    arango = require('..')
}

function check(done, f) {
    try {
        f()
        done()
    } catch (e) {
        console.log(e);
        done(e)
    }
}

function setJobs() {

}

describe("async", function() {
    if (typeof window !== "undefined") {
        port = window.port;
    } else {
        port = require('./port.js');
        port = port.port;
    }


    before(function(done) {
        this.timeout(50000);
        db = arango.Connection("http://127.0.0.1:" + port);
        db.database.delete("newDatabase", function(err, ret) {
            db.database.create("newDatabase", function(err, ret) {
                db = db.use('/newDatabase');
                done();
            });
        });

    })

    describe("async Functions", function() {

        it('lets create a collection in normal mode ....we expect a result', function(done) {
            this.timeout(50000);
            db.collection.create("newCollection", function(err, ret, message) {
                check(done, function() {
                    ret.status.should.equal(3);
                    ret.error.should.equal(false);
                    message.status.should.equal(200);
                });
            });
        })
        it('lets create a collection in async store mode ....we only expect a header with a job id', function(done) {
            this.timeout(50000);
            db.setAsyncMode(true).collection.create("newCollection2", function(err, ret, message) {
                check(done, function() {
                    var keys = Object.keys(message.headers);
                    var e = keys.indexOf("x-arango-async-id");
                    e.should.not.equal(-1);
                    message.status.should.equal(202);
                });
            });
        })
        it('lets create a collection in async fire and forget mode ....we only expect a header without a job id', function(done) {
            this.timeout(50000);
            db.setAsyncMode(true, true).collection.create("newCollection3", function(err, ret, message) {
                check(done, function() {
                    ret.should.equal("");
                    var keys = Object.keys(message.headers);
                    var e = keys.indexOf("x-arango-async-id");
                    e.should.equal(-1);
                    message.status.should.equal(202);
                });
            });
        })

        it('Ok, we switched to fire and forget, lets check if db is still configured that way.', function(done) {
            this.timeout(50000);
            db.collection.create("newCollection", function(err, ret, message) {
                check(done, function() {
                    ret.should.equal("");
                    var keys = Object.keys(message.headers);
                    var e = keys.indexOf("x-arango-async-id");
                    e.should.equal(-1);
                    message.status.should.equal(202);
                });
            });
        })
        it('lets switch back to normal mode ....we expect a result', function(done) {
            this.timeout(50000);
            db.setAsyncMode(false).collection.create("newCollection6", function(err, ret, message) {
                check(done, function() {
                    ret.status.should.equal(3);
                    ret.error.should.equal(false);
                    message.status.should.equal(200);
                });
            });
        })
        it('lets create a collection in normal mode ....we expect a result', function(done) {
            this.timeout(50000);
            db.collection.create("newCollection7", function(err, ret, message) {
                check(done, function() {
                    ret.status.should.equal(3);
                    ret.error.should.equal(false);
                    message.status.should.equal(200);
                });
            });
        })
        it('lets switch back to async store mode ....and create some jobs', function(done) {
            this.timeout(50000);
            db.setAsyncMode(true).collection.create("newCollection10", function(err, ret, message) {
                check(done, function() {
                    ret.should.equal("");
                    var keys = Object.keys(message.headers);
                    var e = keys.indexOf("x-arango-async-id");
                    e.should.not.equal(-1);
                    message.status.should.equal(202);
                });
            });
        })
        it('create a document', function(done) {
            this.timeout(50000);
            db.document.create("newCollection10", {
                "key1": "val1",
                "key2": "val2",
                "key3": null
            }, function(err, ret, message) {
                check(done, function() {
                    ret.should.equal("");
                    var keys = Object.keys(message.headers);
                    var e = keys.indexOf("x-arango-async-id");
                    e.should.not.equal(-1);
                    message.status.should.equal(202);
                });
            });
        })
        it('create a document', function(done) {
            this.timeout(50000);
            db.document.create("newCollection10", {
                "key1": "val1",
                "key2": "val2",
                "key3": null
            }, function(err, ret, message) {
                check(done, function() {
                    ret.should.equal("");
                    var keys = Object.keys(message.headers);
                    var e = keys.indexOf("x-arango-async-id");
                    e.should.not.equal(-1);
                    message.status.should.equal(202);
                });
            });
        })
        it('create a document', function(done) {
            this.timeout(50000);
            db.document.create("newCollection100", {
                "key1": "val1",
                "key2": "val2",
                "key3": null
            }, function(err, ret, message) {
                check(done, function() {
                    ret.should.equal("");
                    var keys = Object.keys(message.headers);
                    var e = keys.indexOf("x-arango-async-id");
                    e.should.not.equal(-1);
                    message.status.should.equal(202);
                });
            });
        })
        it('create a document', function(done) {
            this.timeout(50000);
            db.document.create("newCollection10", {
                "key1": "val1",
                "key2": "val2",
                "key3": null
            }, function(err, ret, message) {
                check(done, function() {
                    ret.should.equal("");
                    var keys = Object.keys(message.headers);
                    var e = keys.indexOf("x-arango-async-id");
                    e.should.not.equal(-1);
                    message.status.should.equal(202);
                });
            });
        })
        it('lets switch back to normal mode ....and get the list of jobs', function(done) {
            this.timeout(50000);
            db.setAsyncMode(false).job.get("pending", function(err, ret, message) {
                check(done, function() {
                    message.status.should.equal(200);
                });
            });
        })
        it('lets delete the job queue', function(done) {
            this.timeout(50000);
            db.job.delete("all", function(err, ret, message) {
                check(done, function() {
                    ret.result.should.equal(true);
                    message.status.should.equal(200);
                });
            });
        })
        it('lets get the list of jobs', function(done) {
            this.timeout(50000);
            db.job.get("done", function(err, ret, message) {
                check(done, function() {
                    ret.length.should.equal(0);
                    message.status.should.equal(200);
                });
            });
        })
        it('lets switch back to async store mode ....and create failing jobs', function(done) {
            this.timeout(50000);
            db.setAsyncMode(true).collection.create("newCollection10", function(err, ret, message) {
                check(done, function() {
                    storedJobs[message.headers["x-arango-async-id"]] = 409;
                    ret.should.equal("");
                    var keys = Object.keys(message.headers);
                    var e = keys.indexOf("x-arango-async-id");
                    e.should.not.equal(-1);
                    message.status.should.equal(202);
                });
            });
        })
        it('create a failing document', function(done) {
            this.timeout(50000);
            db.document.create("newCollection100", {
                "key1": "val1",
                "key2": "val2",
                "key3": null
            }, function(err, ret, message) {
                check(done, function() {
                    storedJobs[message.headers["x-arango-async-id"]] = 404;
                    ret.should.equal("");
                    var keys = Object.keys(message.headers);
                    var e = keys.indexOf("x-arango-async-id");
                    e.should.not.equal(-1);
                    message.status.should.equal(202);
                });
            });
        })
        it('create a document', function(done) {
            this.timeout(50000);
            db.document.create("newCollection10", {
                "key1": "val1",
                "key2": "val2",
                "key3": null
            }, function(err, ret, message) {
                check(done, function() {
                    ret.should.equal("");
                    storedJobs[message.headers["x-arango-async-id"]] = 202;
                    var keys = Object.keys(message.headers);
                    var e = keys.indexOf("x-arango-async-id");
                    e.should.not.equal(-1);
                    message.status.should.equal(202);
                });
            });
        })
        it('create a failing document', function(done) {
            this.timeout(50000);
            db.document.create("newCollection100", {
                "key1": "val1",
                "key2": "val2",
                "key3": null
            }, function(err, ret, message) {
                check(done, function() {
                    ret.should.equal("");
                    storedJobs[message.headers["x-arango-async-id"]] = 404;
                    var keys = Object.keys(message.headers);
                    var e = keys.indexOf("x-arango-async-id");
                    e.should.not.equal(-1);
                    message.status.should.equal(202);
                });
            });
        })
        it('lets switch back to normal mode ....and get the job result', function(done) {
            this.timeout(50000);

            function callDb(done) {
                db.setAsyncMode(false).job.get("done", function(err, ret, message) {
                    var jobs = ret;
                    if (jobs.length != 4) {
                        callDb(done);
                        return;
                    }
                    done();
                })
            }

            callDb(done);

        })
        it('lets get the job results', function(done) {
            this.timeout(50000);
            Object.keys(storedJobs).forEach(function(key) {
                db.job.put(key, function(err, ret, message) {
                    message.status.should.equal(storedJobs[key]);
                });
            })
            done();

        })

    })

})