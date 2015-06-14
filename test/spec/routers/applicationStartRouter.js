(function() {
	'use strict';

	var root = this;

	root.define([
		'routers/applicationStartRouter'
		],
		function( Applicationstartrouter ) {

			describe('Applicationstartrouter Router', function () {

				it('should be an instance of Applicationstartrouter Router', function () {
					var applicationStartRouter = new Applicationstartrouter();
					expect( applicationStartRouter ).to.be.an.instanceof( Applicationstartrouter );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );