// imports
const odbc = require('odbc');
const string = require('string');
const express = require('express');
const config = require('config');
const router = express.Router();

// const
const db = new odbc.Database();
const odbcPool = new odbc.Pool();
const REQUIRED_PARAMS = ['db', 'ip', 'user', 'password', 'port', 'query'];
const CONNECTION_PATTERN = config.get('odbc.connectionPattern');


router.all('/query', function(req, res, next) {

    console.log(CONNECTION_PATTERN)

    var missings = REQUIRED_PARAMS.filter(function(parm) {
        return !req.body[parm];
    });

    if (missings.length) return error(res, 'Missing "' + missings.join('", "') + '"');

    odbcPool.open(string(CONNECTION_PATTERN).template(req.body).s, function(err, conn) {

        if (err) {
            return error(res, err);
        }

        conn.query(req.body.query, function(err, data) {

            conn = null;

            if (err) {
                return error(res, err);
            } else {
                res.send(data);
            }
        });
    });
});

function error(res, err) {

    console.error(err);

    return res.send({
        isError: true,
        error: typeof(err) == 'string' ? err : err.message
    });
}


module.exports = router;