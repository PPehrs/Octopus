(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/playerName'
		],
		function( Playername ) {

			describe('Playername Itemview', function () {

				it('should be an instance of Playername Itemview', function () {
					var playerName = new Playername();
					expect( playerName ).to.be.an.instanceof( Playername );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );