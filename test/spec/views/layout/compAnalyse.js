(function() {
	'use strict';

	var root = this;

	root.define([
		'views/layout/compAnalyse'
		],
		function( Companalyse ) {

			describe('Companalyse Layout', function () {

				it('should be an instance of Companalyse Layout', function () {
					var compAnalyse = new Companalyse();
					expect( compAnalyse ).to.be.an.instanceof( Companalyse );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );