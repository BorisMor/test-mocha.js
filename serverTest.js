/**
 * Тестовый сервер
 * https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
 * 
 * Для разбора application/json или form-data:
 * https://www.npmjs.com/package/formidable
 * npm install formidable@latest --save
 * 
 */

var http = require("http");
var formidable = require("formidable");
var url = require("url");

/**
 * Разбор form-data или application/json
 * @param {*} req 
 */
function getFormData(req) {
    return new Promise(function(resolve, reject) {
        var form = new formidable.IncomingForm();
        form.parse(req, function(error, fields, files) {
            if (error) {
                console.log('parseFormData: ', error.message)
                reject(error.message);
            } else {
                resolve(fields, files);
            }
        });
    });
}

/**
 * Разбор только application/json (но средствами node.js)
 * @param {*} req 
 */
function getDataHttp(req) {
    return new Promise(function(resolve, reject) {
        var body = [];
        req.on('error', function(err) {
            reject(err)
        }).on('data', function(chunk) {
            body.push(chunk);
        }).on('end', function() {
            body = Buffer.concat(body).toString();
            resolve(body)
        });
    });
}


var server = http.createServer(function(req, res) {
    var method = req.method;
    var url = req.url;
    var contentType = typeof req.headers['content-type'] == "undefined" ? "undefined" : req.headers['content-type']

    var resData = {
        "method": method,
        "url": url,
        "content-type": contentType
    };

    console.log(method, url);

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
    });

    getFormData(req).then(
        function(fields, files) {
            resData['data'] = fields;
            res.write(JSON.stringify(resData));
            res.end()
        },
        function(error) {
            resData['error'] = error;
            res.write(JSON.stringify(resData));
            res.end()
        }
    );


    // getDataHttp(req).then(
    //     function(data) {
    //         resData['data'] = data;
    //         res.write(JSON.stringify(resData));
    //         res.end();
    //     },
    //     function(error) {
    //         resData['error'] = error;
    //         res.write(JSON.stringify(resData));
    //         res.end();
    //     }
    // );

});

server.listen(8080);
console.log("Server is listening localhost:8080");