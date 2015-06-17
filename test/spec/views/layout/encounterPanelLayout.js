(function() {
	'use strict';

	var root = this;

	root.define([
		'views/layout/encounterPanelLayout'
		],
		function( Encounterpanellayout ) {

			describe('Encounterpanellayout Layout', function () {

				it('should be an instance of Encounterpanellayout Layout', function () {
					var encounterPanelLayout = new Encounterpanellayout();
					expect( encounterPanelLayout ).to.be.an.instanceof( Encounterpanellayout );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );