(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/playerScore'
		],
		function( Playerscore ) {

			describe('Playerscore Itemview', function () {

				it('should be an instance of Playerscore Itemview', function () {
					var playerScore = new Playerscore();
					expect( playerScore ).to.be.an.instanceof( Playerscore );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );