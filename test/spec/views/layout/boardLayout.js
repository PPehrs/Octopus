(function() {
	'use strict';

	var root = this;

	root.define([
		'views/layout/boardLayout'
		],
		function( Boardlayout ) {

			describe('Boardlayout Layout', function () {

				it('should be an instance of Boardlayout Layout', function () {
					var boardLayout = new Boardlayout();
					expect( boardLayout ).to.be.an.instanceof( Boardlayout );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );