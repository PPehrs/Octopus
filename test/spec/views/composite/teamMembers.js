(function() {
	'use strict';

	var root = this;

	root.define([
		'views/composite/teamMembers'
		],
		function( Teammembers ) {

			describe('Teammembers Compositeview', function () {

				it('should be an instance of Teammembers Compositeview', function () {
					var teamMembers = new Teammembers();
					expect( teamMembers ).to.be.an.instanceof( Teammembers );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );