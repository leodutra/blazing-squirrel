var Data2HTMLResultBuilder = (function() {

	'use strict';

	var ISO_2_TIMESTAMP_REGEX = /(['"])(\d{4}-\d\d-\d\d)T(\d\d:\d\d:\d\d\.\d{3})Z(['"])/gm;

	function Data2HTMLResultBuilder() {}

	Data2HTMLResultBuilder.prototype = {

		build: function(data, className) {

			data = JSON.stringify(data);

			data = escapeHTMLInJSON(data);
			data = isoTimeToTimestamp(data);

			data = JSON.parse(data);

			var columns = Object.getOwnPropertyNames(data[0]);

			var result = '<p><span class="label label-default">'+ (data.length + ' registro(s).')+'</span></p>'+
			'<table class="'+ (className || '') + '"><thead><tr>';

			for (var i = 0, l = columns.length; i < l;) {
				result += '<th>' + columns[i++] + '</th>';
			}

			result += '</tr></thead><tbody>';

			for (var i = 0, l = data.length, item; i < l;) {

				result += '<tr>';

				item = data[i++];

				for (var j = 0, k = columns.length; j < k;) {

					//children[j].textContent = item[columns[j]] + '';
					result += '<td>' + item[columns[j++]] + '</td>';
				}

				result += '</tr>';
			}
			result += '</tbody></table>';

			return result;
		}
	}

	function escapeHTMLInJSON(value) {
		return value.replace(/[<>]/gm, function (match) { 
				return '&' + (match === '<' ? 'lt;' : 'gt;'); 
			});
	}

	function isoTimeToTimestamp(value) {
		return value.replace(ISO_2_TIMESTAMP_REGEX, '$1<span style=\\"white-space: nowrap;\\">$2 $3</span>$4');
	}

	return Data2HTMLResultBuilder;
})();

