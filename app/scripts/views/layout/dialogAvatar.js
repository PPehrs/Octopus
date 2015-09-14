define([
	'backbone',
	'communicator',
	'backbone.stickit',
	'backbone.validation',
	'hbs!tmpl/layout/dialogAvatar_tmpl'
],
function( Backbone, Communicator, Stickit, Validation, DialogteamTmpl ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		teams: null,

		initialize: function() {
			this.model = new Backbone.Model({
				avatar: null
			})
		},

    	template: DialogteamTmpl,


    	/* Layout sub regions */
    	regions: {
    	},


		/* ui selector cache */
		ui: {
			avatar: '.img-circle',
			image: '#octopus_player_imageFile',
			selectedImage: '#octopus_selected_player_imageFile',
			fileButton: '.fileUpload'
		},


		/* Ui events hash */
		events: {
			'change @ui.image': 'onChangeImage',
			'click @ui.avatar': 'onClickAvatar'
		},

		imageData: null,

		onClickAvatar: function (e) {
			this.ui.fileButton.click();
		},

		onChangeImage: function (e) {
			var _self = this;
			var file = e.originalEvent.target.files[0],
				reader = new FileReader();
				reader.onload = function(evt){
				_self.ui.selectedImage.attr('src', evt.target.result);
				_self.imageData = evt.target.result;
			};
			reader.readAsDataURL(file);
		},


		/* on render callback */
		onRender: function() {
			Backbone.Validation.bind(this);
		},


		validate: function () {
			if(this.imageData) {
 				this.model.set('avatar', this.imageData);
			}
		}
	});

});
