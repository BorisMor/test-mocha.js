/**
 * Простейший тест
 */

var supertest = require("supertest");
var server = supertest.agent("http://localhost:8080");

describe("Описание теста", function() {
    it("Test #1", function(done) {
        server.get('/')
            .set('Accept', 'application/json')
            .expect(200, done)
    });
});