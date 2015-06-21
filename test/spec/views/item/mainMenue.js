(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/mainMenue'
		],
		function( Mainmenue ) {

			describe('Mainmenue Itemview', function () {

				it('should be an instance of Mainmenue Itemview', function () {
					var mainMenue = new Mainmenue();
					expect( mainMenue ).to.be.an.instanceof( Mainmenue );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );