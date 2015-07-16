define([
	'backbone',
	'hbs!tmpl/layout/playerLayout_tmpl',
	'../item/board/playerMenu',
	'../item/board/playerName',
	'../composite/board/playerScores',
	'models/player'
],
function( Backbone, PlayerlayoutTmpl, PlayerMenu, PlayerName, PlayerScores, PlayerModel ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		template: PlayerlayoutTmpl,

		otherPlayer: null,

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

		stats : function (res) {
			var col = this.PlayerScoresRegion.currentView.collection.length;
			var tDarts = (col - 1) * 3;
			this.PlayerMenuRegion.currentView.setStats(tDarts, res.ave, res.dbl);
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
			var resultInfo = this.model.get('resultInfo');
			resultInfo.load = true;
			resultInfo.scores = scores;
			return this.loadPlayerScores();
		},

		loadPlayerScores: function() {
			var load = this.model.get('resultInfo').load;
			var isLeft = this.model.get('isLeft');
			var collection = new Backbone.Collection({
				score: 501,
				isTop: true,
				value: null,
				isLeft: this.model.get('isLeft')
			});

			var scores = this.model.get('resultInfo').scores;
			var topRest = 501;
			if(load && !_.isEmpty(scores)) {
				var self = this;
				_.each(scores, function(score, pos) {
					var scoreBefore = collection.at(0);
					scoreBefore.set('isTop', false);
					var rest = scoreBefore.get('score') - score.value;
					if(rest <= 1) { rest = scoreBefore.get('score');}
					topRest = rest;
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

			return topRest;
		},

		/* on render callback */
		onRender: function() {
			var resultModel = _.extend({}, this.model.get('resultInfo'), {isLeft:this.model.get('isLeft')})
			this.PlayerMenuRegion.show(new PlayerMenu({
				model: new Backbone.Model(resultModel)
			}))
			var nameModel = _.extend({}, this.model.get('nameInfo'), {isLeft:this.model.get('isLeft')})
			this.PlayerNameRegion.show(new PlayerName({
				model: new PlayerModel(nameModel)
			}))

			this.loadPlayerScores();
		}
	});

});
