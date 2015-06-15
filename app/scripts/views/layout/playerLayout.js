define([
	'backbone',
	'hbs!tmpl/layout/playerLayout_tmpl',
	'../item/playerMenu',
	'../item/playerName',
	'../composite/playerScores'
],
function( Backbone, PlayerlayoutTmpl, PlayerMenu, PlayerName, PlayerScores ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		template: PlayerlayoutTmpl,


		/* Layout sub regions */
		regions: {
			PlayerMenuRegion: '.octopus_playerMenu',
			PlayerNameRegion: '.octopus_playerName',
			PlayerScoresRegion: '.octopus_playerScores'
		},

		/* ui selector cache */
		ui: {},

		/* Ui events hash */
		events: {},

		childEvents: {
			'playerMenu:player:active': function (child, isLeft) {
				this.triggerMethod('playerMenu:player:active', isLeft);
			},
			'playerMenu:switch:names': function () {
				this.triggerMethod('playerMenu:switch:names');
			},
			'playerName:change:name': function (child, name, isLeft) {
				this.triggerMethod('playerName:change:name', name, isLeft);
			},
			'playerName:change:activePlayer': function (child, isLeft) {
				this.triggerMethod('playerName:change:activePlayer', isLeft);
			},
			'playerScore:change:value': function (child, value, uid) {
				this.triggerMethod('playerScore:change:value', value, uid);
			}
		},

		deleteLastScore: function() {
			var scoresView = this.PlayerScoresRegion.currentView;

			var lastScore = scoresView.collection.at(1);
			scoresView.collection.remove(lastScore);

			var topScore = scoresView.collection.at(0);
			topScore.set({
				uid: lastScore.get('uid'),
				score: lastScore.get('score'),
				isTop: true,
				value: lastScore.get('value'),
				isLeft: this.model.get('isLeft')
			});

		},

		newScore: function (value, uid) {
			var scoresView = this.PlayerScoresRegion.currentView;
			var col = this.PlayerScoresRegion.currentView.collection;

			var topScore = scoresView.collection.at(0);
			var total = Number(this._sum(col.pluck('value'))) + Number(value);

			scoresView.collection.add({
				uid: topScore.get('uid'),
				score: topScore.get('score'),
				isTop: false,
				value: topScore.get('value'),
				isLeft: this.model.get('isLeft')
			}, {at: 1, silent: true});

			var rest = 501 - Number(total);
			if(rest <= 1) { rest = topScore.get('score');}

			topScore.set({
				score: rest,
				value: value,
				uid: uid
			});
		},

		_sum: function (obj) {
			if (!$.isArray(obj) || obj.length == 0) {
				return 0;
			}
			return _.reduce(obj, function (sum, n) {
				var s = Number(sum);
				return Number(s += Number(n));
			});
		},

		refresh: function () {
			this.PlayerMenuRegion.currentView.render();
			this.PlayerNameRegion.currentView.render();
			this.PlayerScoresRegion.currentView.render();
		},

		reloadPlayerScores: function(scores) {
			this.model.set({
				load:true,
				scores: scores
			});
			this.loadPlayerScores();
			this.PlayerScoresRegion.currentView.render();
		},

		loadPlayerScores: function() {
			var load = this.model.get('load');
			var collection = new Backbone.Collection({
				score: 501,
				isTop: true,
				value: null,
				isLeft: this.model.get('isLeft')
			});

			var scores = this.model.get('scores');
			if(load && !_.isEmpty(scores)) {
				var self = this;
				_.each(scores, function(score, pos) {
					var scoreBefore = collection.at(0);
					scoreBefore.set('isTop', false);
					var rest = scoreBefore.get('score') - score.value;
					collection.add({
						uid: score.uid,
						score: rest,
						isTop: true,
						value: score.value,
						isLeft: self.model.get('isLeft')
					}, {at: 0, silent: true});
				})
			}

			this.PlayerScoresRegion.show(new PlayerScores({
				collection: collection
			}));
		},

		/* on render callback */
		onRender: function() {
			this.PlayerMenuRegion.show(new PlayerMenu({
				model: this.model
			}))
			this.PlayerNameRegion.show(new PlayerName({
				model: this.model
			}))

			this.loadPlayerScores();
		}
	});

});
