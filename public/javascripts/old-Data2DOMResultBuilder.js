var Data2DOMResultBuilder = (function() {

	'use strict';

	function Data2DOMResultBuilder() {}

	Data2DOMResultBuilder.prototype = {

		build: function(data, className) {

			data = escapeHTMLInJSON(data);

			var columns = [];

			var table = document.createElement('table');
			if (typeof className == 'string') table.className = className;

			var thead = document.createElement('thead');
			
			var columns = Object.getOwnPropertyNames(data[0]);

			var docFragment = document.createDocumentFragment();
			var innerFragment = document.createDocumentFragment();

			for (var i = 0, l = columns.length; i < l;) {
				docFragment.appendChild(document.createElement('th')).textContent = columns[i++] + '';
				innerFragment.appendChild(document.createElement('td'));
			}

			var tr = document.createElement('tr');
			tr.appendChild(docFragment);
			thead.appendChild(tr);
			table.appendChild(thead); // APPEND HEADER

			tr = document.createElement('tr');
			tr.appendChild(innerFragment);

			var children = tr.children;

			var tbody = document.createElement('tbody');
			docFragment = document.createDocumentFragment();

			for (var i = 0, l = data.length; i < l;) {

				item = data[i++];

				for (var j = 0, k = columns.length; j < k; j++) {
					children[j].textContent = item[columns[j]] + '';
				}

				docFragment.appendChild(tr.cloneNode(true));
			}

			tbody.appendChild(docFragment);
			table.appendChild(tbody);
			
			return table;
		}
	}

	function escapeHTMLInJSON(json) {
		return JSON.parse(
			JSON.stringify(json).replace(/[<>]/gm, function (match) { 
				return '&' + (match == '<' ? 'lt;' : 'gt;'); 
			})
		);
	}

	return Data2DOMResultBuilder;
})();
