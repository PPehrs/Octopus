define([
	'backbone',
	'communicator',
	'chart',
	'../composite/player/playerMatches',
	'../item/player/playerStatisticFirst',
	'hbs!tmpl/layout/profileLayout_tmpl',
	'./dialogAvatar'
],
function( Backbone, Communicator, Chart, PlayerMatches, PlayerStatisticFirst, ProfilelayoutTmpl, DialogAvatar  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {
			this.listenTo(Communicator.mediator, 'APP:SOCKET:CONNECTED', this._onSocketConnected);
			this.listenTo(Communicator.mediator, 'DialogModule:AVATAR-SAVED', this.loadAvatar);
			_.bindAll(this, '_onLoadMatches', 'loadAvatar', '_onLoadAvatar');
		},

    	template: ProfilelayoutTmpl,


    	/* Layout sub regions */
    	regions: {
			PlayerMatchesRegion: '#octopus_playerMatches',
			PlayerStatisticFirstRegion: '#octopus_playerStatistic_first'
		},

    	/* ui selector cache */
    	ui: {
			matchesChart: '#octopus_matchesChart',
			selectedImage: '#octopus_selected_player_imageFile',
			formChart: '#octopus_formChart'
		},


		/* Ui events hash */
		events: {
			'click @ui.selectedImage': 'onChangeImage'
		},

		onRender: function () {
			this.ui.selectedImage.hide();
		},

		loadAvatar: function () {
			App.module('SocketModule').LoadAvatar(this._onLoadAvatar, this);
		},

		_onLoadAvatar: function (data) {
			if(data && data.avatar) {
				this.ui.selectedImage.attr('src', data.avatar);
			}

			this.ui.selectedImage.fadeIn('slow');
		},

		onChangeImage: function (e) {
			App.module('DialogModule').showConfirm('Profil-Bild speichern', DialogAvatar, 'UploadAvatar');
		},


		_onSocketConnected: function () {
			this._ticker();
		},

		_ticker: function () {
			if(!this.isDestroyed) {
				this.loadAvatar();
				App.module('SocketModule').GetPlayerMatches(this._onLoadMatches, this);
			}
		},

		_onLoadMatches: function (matches) {
			this.PlayerMatchesRegion.show(new PlayerMatches({
				matches: _.first(matches, 10)
			}));

			var statsCalc = App.module('StatisticController').calculatePlayerStatistic(matches);
			this.PlayerStatisticFirstRegion.show(new PlayerStatisticFirst({
				model: new Backbone.Model(statsCalc)
			}));

			this.tab1(statsCalc);
		},

		tab1: function (statsCalc) {
			var o40 = _.filter(statsCalc.darts, function(c) { return c > 40 })
			var o30 = _.filter(statsCalc.darts, function(c) { return c <= 40 && c > 30 })
			var o20 = _.filter(statsCalc.darts, function(c) { return c <= 30 && c > 20 })
			var u20 = _.filter(statsCalc.darts, function(c) { return c <= 20 })
			var i30 = _.filter(statsCalc.darts, function(c) { return c === 30 })
			var i29 = _.filter(statsCalc.darts, function(c) { return c === 29 })
			var i28 = _.filter(statsCalc.darts, function(c) { return c === 28 })
			var i27 = _.filter(statsCalc.darts, function(c) { return c === 27 })
			var i26 = _.filter(statsCalc.darts, function(c) { return c === 26 })
			var i25 = _.filter(statsCalc.darts, function(c) { return c === 25 })
			var i24 = _.filter(statsCalc.darts, function(c) { return c === 24 })
			var i23 = _.filter(statsCalc.darts, function(c) { return c === 23 })
			var i22 = _.filter(statsCalc.darts, function(c) { return c === 22 })
			var i21 = _.filter(statsCalc.darts, function(c) { return c === 21 })
			var i20 = _.filter(statsCalc.darts, function(c) { return c === 20 })
			var i19 = _.filter(statsCalc.darts, function(c) { return c === 19 })
			var i18 = _.filter(statsCalc.darts, function(c) { return c === 18 })
			var i17 = _.filter(statsCalc.darts, function(c) { return c === 17 })
			var i16 = _.filter(statsCalc.darts, function(c) { return c === 16 })
			var i15 = _.filter(statsCalc.darts, function(c) { return c === 15 })
			var i14 = _.filter(statsCalc.darts, function(c) { return c === 14 })
			var i13 = _.filter(statsCalc.darts, function(c) { return c === 13 })
			var i12 = _.filter(statsCalc.darts, function(c) { return c === 12 })
			var i11 = _.filter(statsCalc.darts, function(c) { return c === 11 })
			var i10 = _.filter(statsCalc.darts, function(c) { return c === 10 })
			var i9 = _.filter(statsCalc.darts, function(c) { return c === 9 })

			var data = {
				labels: ["über 40", "über 30", "über 20", "unter 20", "30", "29", "28", "27", "26", "25", "24", "23", "22", "20", "19", "18", "17", "16", "15", "14", "13", "12", "11", "10", "9"],
				datasets: [
					{
						label: "Anzahl Darts",
						fillColor: "rgba(151,187,205,0.5)",
						strokeColor: "rgba(151,187,205,0.8)",
						highlightFill: "rgba(151,187,205,0.75)",
						highlightStroke: "rgba(151,187,205,1)",
						data: [o40.length, o30.length, o20.length, u20.length, i30.length, i29.length, i28.length, i27.length, i26.length, i25.length, i24.length, i23.length, i22.length, i21.length, i20.length, i19.length, i18.length, i17.length, i16.length, i15.length, i14.length, i13.length, i12.length, i11.length, i10.length, i9.length]
					}
				]
			};

			var options = {
				//Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
				scaleBeginAtZero : true,

					//Boolean - Whether grid lines are shown across the chart
					scaleShowGridLines : true,

				//String - Colour of the grid lines
				scaleGridLineColor : "rgba(0,0,0,.05)",

				//Number - Width of the grid lines
				scaleGridLineWidth : 1,

				//Boolean - Whether to show horizontal lines (except X axis)
				scaleShowHorizontalLines: true,

				//Boolean - Whether to show vertical lines (except Y axis)
				scaleShowVerticalLines: true,

				//Boolean - If there is a stroke on each bar
				barShowStroke : true,

				//Number - Pixel width of the bar stroke
				barStrokeWidth : 2,

				//Number - Spacing between each of the X value sets
				barValueSpacing : 5,

				//Number - Spacing between data sets within X values
				barDatasetSpacing : 1,

				//String - A legend template
				legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

			}

			var ctx = this.ui.formChart.get(0).getContext("2d");
			var formChart = new Chart(ctx).Bar(data, options);
			formChart.update();
		},


		/* on render callback */
		onShow: function() {
			this._ticker();
		}
	});

});
