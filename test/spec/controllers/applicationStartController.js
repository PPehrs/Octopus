(function() {
	'use strict';

	var root = this;

	root.define([
		'controllers/applicationStartController'
		],
		function( Applicationstartcontroller ) {

			describe('Applicationstartcontroller Controller', function () {

				it('should be an instance of Applicationstartcontroller Controller', function () {
					var applicationStartController = new Applicationstartcontroller();
					expect( applicationStartController ).to.be.an.instanceof( Applicationstartcontroller );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );