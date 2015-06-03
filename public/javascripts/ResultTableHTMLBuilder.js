var ResultTableHTMLBuilder = (function() {

	'use strict';

	function ResultTableHTMLBuilder() {}

	ResultTableHTMLBuilder.prototype = {

		build: function(data, className) {

			data = escapeHTMLInJSON(data);

			var columns = Object.getOwnPropertyNames(data[0]);

			var result = ['<table class="'+ (className || '') + '"><thead><tr>'];

			for (var i = 0, l = columns.length; i < l;) {
				result.push('<th>' + columns[i++] + '</th>');
			}

			result.push('</tr></thead><tbody>');

			for (var i = 0, l = data.length, item; i < l;) {

				result.push('<tr>');

				item = data[i++];

				for (var j = 0, k = columns.length; j < k;) {

					//children[j].textContent = item[columns[j]] + '';
					result.push('<td>' + item[columns[j++]] + '</td>');
				}

				result.push('</tr>');
			}

			result.push('</tbody></table>');

			return result.join('');
		}
	}

	function escapeHTMLInJSON(json) {
		return JSON.parse(
			JSON.stringify(json).replace(/[<>]/gm, function (match) { 
				return '&' + (match === '<' ? 'lt;' : 'gt;'); 
			})
		);
	}

	return ResultTableHTMLBuilder;
})();

