var supertest = require("supertest");
var should = require("should");
var assert = require("assert");

var server = supertest.agent("http://localhost:8080");

describe("Проверка тестового сервера", function() {
    this.timeout(15000); // максимальный таймаут ответа сервера

    it("Test #1", function(done) {
        server
            .get('/test1')
            .expect(200)
            .end(function(err, res) {
                /**
                 * Проверка как выполнился запрос. 
                 * Например реакция на неверный код ответа
                 */

                if (err) {
                    assert(false, err.message);
                    return;
                }

                done();
            });
    });

    it("Test #2", function(done) {
        var values = { "val1": 123 };
        server
            .post('/test2')
            .send(values) // Передача параметров
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err, res) {
                // Проверка тела ответа
                res.body.should.be.instanceof(Object); // тип тела
                res.body.method.should.equal("POST"); // значение поля method
                res.body.data.should.have.property("val1", 123)
                done();
            });
    });
});