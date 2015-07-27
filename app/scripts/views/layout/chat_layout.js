define([
	'backbone',
	'communicator',
	'hbs!tmpl/layout/chat_layout_tmpl',
	'bootbox'
],
function( Backbone, Communicator, OnlineChallangeLayoutTmpl, Bootbox  ) {
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
			this.listenTo(Communicator.mediator, 'onlinePlayer:selected', this._onPlayerClick);
		},

    	template: OnlineChallangeLayoutTmpl,

		disabled: false,

		_onPlayerClick: function (p) {
			var lm = App.module('LoginModule');
			if(lm.onWaitForAnswer) {
				var d = '<div><i class="fa fa-ban m-r-s"></i>Zur Zeit nicht möglich.</div>';
				Bootbox.alert(d);
				return;
			}
			if(lm.loggedInUserId() === p.fkUser) {
				var d = '<div>Wenn du mit dir selber spielen willst, dann tu es einfach.</div>';
				Bootbox.alert(d);
				return
			}

			var d = '<div>Es wird eine Match-Anfrage zu <b>' + p.username + '</b> gesendet.</div>' +
					'<div class="m-t" style="color:gray"><i class="fa fa-info-circle m-r-s"></i>Bitte Match-Anfragen nicht wahrlos versenden. Im Zweifel vorher im Chat anfragen ob Interesse besteht.</div>' +
					'<div class="m-t">Match-Anfrage zu <b>' + p.username + '</b> jetzt senden?</div>';

			var _self = this;
			Bootbox.confirm(d, function (result) {
				if (result) {
					lm.onWaitForAnswer = true;
					Communicator.mediator.trigger('CHALLENGE:ANSWER:WAIT', p);
					var sm = App.module('SocketModule');
					p.uid = octopus.uuid();
					p.fkUserFrom = lm.loggedInUserId();
					p.nameFrom = lm.loggedInUserName();
					sm.ChallangeRequest(p);
				}
			});
		},

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
			var lm = App.module('LoginModule');
			if(gc) {
				gc = JSON.parse(gc);
				var txt = ''
				for(var g in gc) {
					var data = gc[g];
					var d = '';
					if(data.fkUser === lm.loggedInUserId()) {
						d = '<div style="margin-left: 10px;"><div><span class="border-5 btn-info">' + data.name + '</span></div>' +
							'<div class="m-t-s m-b m-r-vb">' + data.t + '</div></div>'
					} else {
						d = '<div class="clearfix" style="text-align:right;margin-right: 20px;"><div><span class="border-5 btn-warning">' + data.name + '</span></div>' +
							'<div class="m-t-s m-b m-l-vb">' + data.t + '</div></div>'
					}
					txt += d;
				}
				this.ui.ChatBody.append(txt);
			}
		},

		_onNewChatMessage: function (data, noScroll) {
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

			this.ui.ChatBody.animate({scrollTop: this.ui.ChatBody.prop('scrollHeight')}, 'fast');
		}
	});

});
