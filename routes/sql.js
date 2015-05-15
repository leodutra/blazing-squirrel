var odbc = require('odbc');

var S = require('string');

var db = new odbc.Database();
var pool = new odbc.Pool();

/* GET home page. */
exports.query = function (req, res, next) {

	var missings = ['db', 'ip', 'user', 'password', 'port', 'query'].filter(function (parm) {
		return !req.body[parm];
	});
	
	if (missings.length) {
		return error(res, 'Missing "' + missings.join('", "') + '"');
	}

//	console.info(Array(50).join('-'), 'QUERY', '\n', req.body.query, '\n', Array(55).join('-'));

	var dbConfig = S(
		'DRIVER={DB2};DATABASE={{db}};HOSTNAME={{ip}};UID={{user}};PWD={{password}};PORT={{port}};PROTOCOL=TCPIP'
	).template(req.body).s;

//	console.info('OPEN DB2 CONN');

	pool.open(dbConfig, function (err, conn) {

//		console.info('ACQUIRED DB2 CONN');

		if (err) {
			return error(res, err);
		}

		conn.query(req.body.query, function (err, data) {

			if (err)
				return error(res, err);
			else 
				res.send(data);

			console.info('QUERY RESULT SENT');

			// db.close(function () {
			// 	console.log('DB2 CONN CLOSED');
			// });
		});
	});
};

function error(res, err) {

	console.error(err);
	
	return res.send({
		isError: true,
		error: typeof(err) == 'string' ? err : err.message
	});
}
