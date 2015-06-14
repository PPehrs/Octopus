(function() {
	'use strict';

	var root = this;

	root.define([
		'views/layout/playerLayout'
		],
		function( Playerlayout ) {

			describe('Playerlayout Layout', function () {

				it('should be an instance of Playerlayout Layout', function () {
					var playerLayout = new Playerlayout();
					expect( playerLayout ).to.be.an.instanceof( Playerlayout );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );