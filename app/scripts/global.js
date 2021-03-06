define(['jquery'],
(function($) {
	var _global = this;

	/*_.templateSettings =
	{
		escape: /<%[=-]([\s\S]+?)%>/g,
		interpolate: /<%cleanHtml([\s\S]+?)cleanHtml%>/g,
		evaluate: /<%([\s\S]+?)%>/g
	};*/

	_global.octopus = {};
	if (!_global.octopus.uuid) {
		_global.octopus.uuid = function(){
		    var d = new Date().getTime();
		    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		        var r = (d + Math.random()*16)%16 | 0;
		        d = Math.floor(d/16);
		        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		    });
		    return uuid;
		};
	};

	_global.octopus.replace = function(value, params) {
		if(!params) {
			return value;
		}

		if(_.isArray(params)) {
			var newValue = value;
			_.each(params, function(val, pos) {
				var reg = new RegExp('{[' + pos + ']}', 'g');
				newValue = newValue.replace(reg, val);
			});
			value = newValue;
		} else {
			value = value.replace(/{[0]}/g, params);
		}

		return value;
	};

}).call(this));
