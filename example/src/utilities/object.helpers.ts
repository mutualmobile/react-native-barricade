Object.defineProperty(Object.prototype, "consoleLog", {
	value: function (...messages: any[]) {
		logMessage(this, "log", ...messages);
	},
	enumerable: false
});

Object.defineProperty(Object.prototype, "consoleWarn", {
	value: function (...messages: any[]) {
		logMessage(this, "warn", ...messages);
	},
	enumerable: false
});

Object.defineProperty(Object.prototype, "consoleErr", {
	value: function (...messages: any[]) {
		logMessage(this, "error", ...messages);
	},
	enumerable: false
});

function logMessage(instance: Object, type: string, ...messages: any[]) {
	if (__DEV__) {
		const tag =
			instance && instance.constructor && instance.constructor.name
				? "[" + instance.constructor.name + "]"
				: "";
		console[type](tag, ...messages);
	}
}
