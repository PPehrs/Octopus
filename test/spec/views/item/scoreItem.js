(function() {
	'use strict';

	var root = this;

	root.define([
		'views/item/scoreItem'
		],
		function( Scoreitem ) {

			describe('Scoreitem Itemview', function () {

				it('should be an instance of Scoreitem Itemview', function () {
					var scoreItem = new Scoreitem();
					expect( scoreItem ).to.be.an.instanceof( Scoreitem );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );