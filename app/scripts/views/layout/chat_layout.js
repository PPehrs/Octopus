define([
	'backbone',
	'communicator',
	'hbs!tmpl/layout/chat_layout_tmpl'
],
function( Backbone, Communicator, OnlineChallangeLayoutTmpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		ui: {
			InputMessage: '#form__chat_message',
			ButtonMessage: '.btn-chat-message',
			ChatBody: '#otopus-chat-body'
		},

		events: {
			'click @ui.ButtonMessage': '_onClickButtonMessage',
			'keypress @ui.InputMessage': '_onKeypressInputMessage'
		},

		initialize: function () {
			_.bindAll(this,'_onSuccess');
			this.listenTo(Communicator.mediator, 'APP:SOCKET:NEW-CHAT-MESSAGE', this._onNewChatMessage);
		},

    	template: OnlineChallangeLayoutTmpl,

		disabled: false,

		_onKeypressInputMessage: function (e) {
			if(e.keyCode === 13) {
				this._onClickButtonMessage();
			}
		},

		_onClickButtonMessage: function () {
			if(this.disabled) {
				return;
			}

			this.disabled = true;
			var _self = this;
			setTimeout(function () {
				_self.disabled = false;
			}, 2000);

			var val = this.ui.InputMessage.val();
			var lm = App.module('LoginModule');

			if(val && lm.loggedInUserId()) {
				var sm = App.module('SocketModule');
				var data = {
					t: val,
					fkUser: lm.loggedInUserId(),
					name: lm.loggedInUserName()
				}
				sm.SendChatMessage(data, this._onSuccess);
			}
		},

		_onSuccess: function () {
			this.ui.InputMessage.val('');
			this.ui.ButtonMessage.css('color', 'green');
			var _self = this;
			setTimeout(function () {
				_self.ui.ButtonMessage.css('color', 'black');
			}, 2000);

		},

		onRender: function () {
			var gc = localStorage.getItem('chat');
			if(gc) {
				gc = JSON.parse(gc);
				for(var g in gc) {
					this._onNewChatMessage(gc[g]);
				}
			}
		},

		onShow: function () {
			this.ui.ChatBody.animate({ scrollTop: this.ui.ChatBody.offset().top }, 'fast');
		},

		_onNewChatMessage: function (data) {
			var lm = App.module('LoginModule');
			if(data.fkUser === lm.loggedInUserId()) {
				var d = '<div style="margin-left: 10px;"><div><span class="border-5 btn-info">' + data.name + '</span></div>' +
						'<div class="m-t-s m-b m-r-vb">' + data.t + '</div></div>'
				this.ui.ChatBody.append(d);
			} else {
				var d = '<div class="clearfix" style="text-align:right;margin-right: 20px;"><div><span class="border-5 btn-warning">' + data.name + '</span></div>' +
					'<div class="m-t-s m-b m-l-vb">' + data.t + '</div></div>'
				this.ui.ChatBody.append(d);
			}

			this.ui.ChatBody.animate({ scrollTop: this.ui.ChatBody.offset().top }, 'fast');
		}

	});

});
