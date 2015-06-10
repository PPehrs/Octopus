(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/playerMenu'
		],
		function( Playermenu ) {

			describe('Playermenu Itemview', function () {

				it('should be an instance of Playermenu Itemview', function () {
					var playerMenu = new Playermenu();
					expect( playerMenu ).to.be.an.instanceof( Playermenu );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );