define([
	'application',
	'bootbox',
	'tooltipster',
	'communicator'
],
function(App, Bootbox, Tooltip, Communicator) {
	App.module('DialogModule', function(DialogModule) {
		'use strict';

		DialogModule.callback = null;
		DialogModule.callbackParam = null;
		DialogModule.startWithParent = true;

		DialogModule.dialogErrorText = '<div class="alert alert-danger dialog-error-text">Fehler<i class="m-l-s fa fa-info-circle"></i></div>';
		DialogModule.dialogInfoText = '<div class="alert alert-info dialog-error-text">Info: {0}<i class="m-l-s fa fa-check-circle"></i></div>';
		DialogModule.dialogWaitInfo = '<i class="fa fa-spin fa-spinner"></i>';
		DialogModule.dialogOk = '<i class="fa fa-check-circle"></i>';

		DialogModule.close = function () {
			bootbox.hideAll();
		},

			DialogModule.showConfirmSocketResult = function (data, self) {
				if (data && data.error) {
					$('.modal-footer').append(
						self.dialogErrorText
					);
					$('.modal-footer .btn-primary').html('Ok');
					$('.modal-footer .dialog-error-text').tooltipster({
						content: $(
							'<span>' + data.error + '</span>'
						)
					});
				} else if (data && data.info) {
					$('.modal-footer').append(
						octopus.replace(self.dialogInfoText, data.info)
					);
					$('.modal-footer .btn-primary').html('Ok');

					$('.modal-footer .btn-primary').html(self.dialogOk);
					setTimeout(function () {
						self.close();
						if(self.callback) {
							self.callback(DialogModule.callbackParam);
						}
					}, 3000);
					Communicator.mediator.trigger('DialogModule:' + data.info, data);
				} else {
					$('.modal-footer .btn-primary').html(self.dialogOk);
					setTimeout(function () {
						self.close();
						if(self.callback) {
							self.callback(DialogModule.callbackParam);
						}
					}, 2000);
				}
			},

			DialogModule.showDialog = function (title, View, btnText, callback, socketAction) {
				var self = this;
				var view = null;
				if (typeof View === 'object') {
					view = View;
				} else {
					view = new View();
				}
				DialogModule.callback = callback;
				DialogModule.callbackParam = null;
				var el = view.render().el;
				bootbox.dialog({
					title: title,
					message: el,
					buttons: {
						cancel: {
							label: 'Cancel',
							className: 'btn-default'
						},
						me: {
							label: btnText,
							className: 'btn-success',
							callback: function () {
								var req = {};
								if (typeof view.afterConfirm === 'function') {
									req = view.afterConfirm('btn-success');
								}
								callback(req);
							}
						},
						confirm: {
							label: 'Ok',
							className: 'btn-primary',
							callback: function () {
								$('.modal-footer .dialog-error-text').remove();

								var txt = $('.modal-footer .btn-primary').html();
								$('.modal-footer .btn-primary').html(self.dialogWaitInfo);

								var validationText = view.model.validate();
								if (typeof view.validate === 'function') {
									validationText = view.validate();
								}
								if (validationText) {
									$('.modal-footer').append(self.dialogErrorText);
									$('.modal-footer .btn-primary').html('Ok');
									$('.modal-footer .dialog-error-text').tooltipster({
										content: $(
											'<span>' + _.pairs(validationText) + '</span>'
										)
									});
									return false;
								}

								if (typeof view.afterConfirm === 'function') {
									DialogModule.callbackParam = view.afterConfirm('btn-primary');
								}

								if (typeof socketAction === 'string') {
									socketAction = eval('App.module("SocketModule").' + socketAction);
								}
								socketAction(view.model, self.showConfirmSocketResult, self);

								return false;
							}
						}
					},
				});
			},

			DialogModule.showConfirm = function (title, View, socketAction) {
				DialogModule.callback = null;
				DialogModule.callbackParam = null;
				var self = this;
				var view = null;
				if (typeof View === 'object') {
					view = View;
				} else {
					view = new View();
				}
				var el = view.render().el;
				bootbox.confirm({
					title: title,
					message: el,
					callback: function (result) {
						if (!result) {
							return true;
						}

						$('.modal-footer .dialog-error-text').remove();

						var txt = $('.modal-footer .btn-primary').html();
						$('.modal-footer .btn-primary').html(self.dialogWaitInfo);

						var validationText = view.model.validate();
						if (typeof view.validate === 'function') {
							validationText = view.validate();
						}
						if (validationText) {
							$('.modal-footer').append(self.dialogErrorText);
							$('.modal-footer .btn-primary').html('Ok');
							$('.modal-footer .dialog-error-text').tooltipster({
								content: $(
									'<span>' + _.pairs(validationText) + '</span>'
								)
							});
							return false;
						}

						if (typeof view.afterConfirm === 'function') {
							view.afterConfirm();
						}

						if (typeof socketAction === 'string') {
							socketAction = eval('App.module("SocketModule").' + socketAction);
						}
						socketAction(view.model, self.showConfirmSocketResult, self);

						return false;
					}
				});
			}

	});
});
