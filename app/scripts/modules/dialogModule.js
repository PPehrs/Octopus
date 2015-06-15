define([
	'application',
	'bootbox',
	'tooltipster',
	'communicator'
],
function(App, Bootbox, Tooltip, Communicator) {
	App.module('DialogModule', function(DialogModule) {
		'use strict';

		DialogModule.startWithParent = true;

		DialogModule.dialogErrorText = '<div class="dialog-error-text">Fehler<i class="m-l-s fa fa-info-circle"></i></div>';
		DialogModule.dialogWaitInfo = '<i class="fa fa-spin fa-spinner"></i>';
		DialogModule.dialogOk = '<i class="fa fa-check-circle"></i>';

		DialogModule.close = function () {
			bootbox.hideAll();
		},

		DialogModule.showConfirmSocketResult = function (data, self) {
			if(data.error) {
				$('.modal-footer').append(self.dialogErrorText);
				$('.modal-footer .btn-primary').html('Ok');
				$('.modal-footer .dialog-error-text').tooltipster({
					content: $(
						'<span>' + data.error + '</span>'
					)
				});
			} else {
				$('.modal-footer .btn-primary').html(self.dialogOk);
				setTimeout(function () {
					self.close();
				}, 2000);
			}
		},

		DialogModule.showConfirm = function(title, View, socketAction) {
			var self = this;
			var view = new View();
			var el = view.render().el;
			bootbox.confirm({
				title: title,
				message: el,
				callback: function (result) {
					if(!result) {
						return true;
					}
					$('.modal-footer .dialog-error-text').remove();

					var txt = $('.modal-footer .btn-primary').html();
					$('.modal-footer .btn-primary').html(self.dialogWaitInfo);

					var validationText = null; //view.model.validate();
					if(validationText) {
						$('.modal-footer').append(self.dialogErrorText);
						$('.modal-footer .btn-primary').html('Ok');
						$('.modal-footer .dialog-error-text').tooltipster({
							content: $(
								'<span>' + _.pairs(validationText) + '</span>'
							)
						});
						return false;
					}

					socketAction = eval('App.module("SocketModule").' + 'RegisterUser');
					socketAction(view.model, self.showConfirmSocketResult, self );

					return false;
				}
			});
		}

	});
});
