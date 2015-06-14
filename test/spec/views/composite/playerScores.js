(function() {
	'use strict';

	var root = this;

	root.define([
		'views/composite/playerScores'
		],
		function( Playerscores ) {

			describe('Playerscores Compositeview', function () {

				it('should be an instance of Playerscores Compositeview', function () {
					var playerScores = new Playerscores();
					expect( playerScores ).to.be.an.instanceof( Playerscores );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );