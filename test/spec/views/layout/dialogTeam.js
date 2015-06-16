(function() {
	'use strict';

	var root = this;

	root.define([
		'views/layout/dialogTeam'
		],
		function( Dialogteam ) {

			describe('Dialogteam Layout', function () {

				it('should be an instance of Dialogteam Layout', function () {
					var dialogTeam = new Dialogteam();
					expect( dialogTeam ).to.be.an.instanceof( Dialogteam );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );