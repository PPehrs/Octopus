(function() {
	'use strict';

	var root = this;

	root.define([
		'views/layout/boardPanelLayout'
		],
		function( Boardpanellayout ) {

			describe('Boardpanellayout Layout', function () {

				it('should be an instance of Boardpanellayout Layout', function () {
					var boardPanelLayout = new Boardpanellayout();
					expect( boardPanelLayout ).to.be.an.instanceof( Boardpanellayout );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );