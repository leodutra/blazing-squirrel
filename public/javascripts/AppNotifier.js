function AppNotifier(defaultTitle, icon) {
	if (this instanceof AppNotifier) {
		this.icon = icon;
		this.defaultTitle = typeof defaultTitle == 'string' ? defaultTitle : '';
	}
}

AppNotifier.prototype = {

	requestPermission: function(onPermissionGranted, onPermissionDenied) {
		if (Notify.needsPermission) {
			Notify.requestPermission(onPermissionGranted, onPermissionDenied);
		} else {
			if (typeof onPermissionGranted == 'function') onPermissionGranted();
		}
	},

	show: function(title, msg, inactiveWindowMode) {

		var notify = new Notify(title || this.defaultTitle, {
		
			body: msg !== void 0 && msg !== null ? msg : '',
			icon: this.icon,
			notifyClick: function() {
				blur(); 
				focus();
			}

		});

		this.requestPermission(
			function onPermissionGranted() {
				if (!inactiveWindowMode || (document.hidden || document.msHidden || 
					document.mozHidden || document.webkitHidden 
					|| (document.hasFocus && !document.hasFocus()))) {
					notify.show();
				}
				notify = null;
			},
			function onPermissionDenied(){}
		);
	}
};