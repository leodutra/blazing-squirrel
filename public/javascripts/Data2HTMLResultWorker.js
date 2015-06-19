importScripts('Data2HTMLResultBuilder.js');

addEventListener('message', function(e) {
	postMessage(new Data2HTMLResultBuilder().build(e.data[0], e.data[1]));
}, false);