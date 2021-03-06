require.config({

    baseUrl: "/scripts",

    /* starting point for application */
    deps: ['backbone', 'backbone.marionette', 'bootstrap', 'bootbox', 'bootstrapswitch', 'bootstrapselect', 'main'],


    shim: {
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
		underscore: {
			exports: '_'
		},
		'backbone.validation': ['backbone'],
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        bootbox: {
            deps: [
                'jquery',
                'bootstrap'
            ],
            exports: 'bootbox'
        },
		moment: {
			exports: 'moment'
		},
        bootstrapswitch: {
            deps: [
                'jquery',
                'bootstrap'
            ],
            exports: 'bootstrapswitch'
        },
		bootstrapselect: {
			deps: [
				'jquery',
				'bootstrap'
			],
			exports: 'bootstrapselect'
		}
    },

    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore-amd/underscore',

        /* alias all marionette libs */
        'backbone.marionette': '../bower_components/backbone.marionette/lib/core/backbone.marionette',
        'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr',
        'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
		'backbone.stickit': '../bower_components/backbone.stickit/backbone.stickit',
		'backbone.validation': '../bower_components/backbone-validation/dist/backbone-validation-amd',

        /* alias the bootstrap js lib */
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',

        /* Alias text.js for template loading and shortcut the templates dir to tmpl */
        text: '../bower_components/requirejs-text/text',
        tmpl: "../templates",

        /* handlebars from the require handlerbars plugin below */
        handlebars: '../bower_components/require-handlebars-plugin/Handlebars',

        tooltipster: '../bower_components/tooltipster/js/jquery.tooltipster.min',

        bootbox: '../bower_components/bootbox/bootbox',

		'socket.io.client': '../bower_components/socket.io-client/socket.io',

        bootstrapswitch: '../bower_components/bootstrap-switch/dist/js/bootstrap-switch.min',
		bootstrapselect: '../bower_components/bootstrap-select/dist/js/bootstrap-select.min',

        /* require handlebars plugin - Alex Sexton */
        i18nprecompile: '../bower_components/require-handlebars-plugin/hbs/i18nprecompile',
        json2: '../bower_components/require-handlebars-plugin/hbs/json2',
        hbs: '../bower_components/require-handlebars-plugin/hbs',

		moment: '../bower_components/moment/min/moment-with-locales.min',

		chart: '../bower_components/chartjs/Chart.min',
    },

    hbs: {
        disableI18n: true
    }
});
