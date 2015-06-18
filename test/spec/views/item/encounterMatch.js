(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/encounterMatch'
		],
		function( Encountermatch ) {

			describe('Encountermatch Itemview', function () {

				it('should be an instance of Encountermatch Itemview', function () {
					var encounterMatch = new Encountermatch();
					expect( encounterMatch ).to.be.an.instanceof( Encountermatch );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );