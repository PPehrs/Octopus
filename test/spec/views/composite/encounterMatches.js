(function() {
	'use strict';

	var root = this;

	root.define([
		'views/composite/encounterMatches'
		],
		function( Encountermatches ) {

			describe('Encountermatches Compositeview', function () {

				it('should be an instance of Encountermatches Compositeview', function () {
					var encounterMatches = new Encountermatches();
					expect( encounterMatches ).to.be.an.instanceof( Encountermatches );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );