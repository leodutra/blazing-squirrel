var AppStorage = {

	get: function(key) {
		return store.get(key);
	},

	set: function(key, value) {
		return store.set(key, value);
	},

	remove: function(key) {
		store.remove(key);
	},

	clear: function(key) {
		store.clear();
	}
};