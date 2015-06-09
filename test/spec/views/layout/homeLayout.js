(function() {
	'use strict';

	var root = this;

	root.define([
		'views/layout/homeLayout'
		],
		function( Homelayout ) {

			describe('Homelayout Layout', function () {

				it('should be an instance of Homelayout Layout', function () {
					var homeLayout = new Homelayout();
					expect( homeLayout ).to.be.an.instanceof( Homelayout );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );