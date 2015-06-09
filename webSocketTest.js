 var socket = require('socket.io-client')('http://85.214.219.136:3000');
  socket.on('connect', function(){
	console.log('connect');
	socket.emit('new-encounter', { 
		home: 'TSG' ,
		guest: 'BAR'
	}, function(data) {
           console.log('new-encounter', data);
        });
  });
  socket.on('event', function(data){
	console.log('event');
  });
  socket.on('disconnect', function(){});

