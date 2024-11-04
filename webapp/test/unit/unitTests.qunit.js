/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comsmodux/custom-control/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
