var mongoose = require('mongoose');
var _ = require('underscore');
var nodemailer = require('nodemailer');

mongoose.connect('mongodb://localhost/octopus');


//--------------------------------------------------
var loginSchema = mongoose.Schema({
	fkUser: String,
	socketId: String,	
	username: String,
	dateTimeStamp: { type: Date, default: Date.now }
});

var userSchema = mongoose.Schema({
	name: String,
	username: String,	
	email: String,
	pw: String,
	dateTimeStamp: { type: Date, default: Date.now }
});

var teamSchema = mongoose.Schema({
	fkUser: String,
	uid: String,
	createdDateTime: { type: Date, default: Date.now },
	name: String,
	captain: String,
	members: []
});
var encounterSchema = mongoose.Schema({
	createdDateTime: { type: Date, default: Date.now },
	uid: String,
	home: Object,
	guest: Object,
});

var matchSchema = mongoose.Schema({
	teams: String,
	fkEncounter: String,
	uid: String,
	startDateTime: { type: Date, default: Date.now },
	endDateTime: { type: Date },
	activeSet: Number,
	leg: Number,
	state: [],
	started: Boolean,
	closed: Boolean,
	players: [],
	activeLeg: Object,
	sets: []
});
//--------------------------------------------------

var Match = null;
var Team = null;
var User = null;
var Encounter = null;
var Login = null;


  	Team = mongoose.model('Team', teamSchema);
	Match = mongoose.model('Match', matchSchema);
	User = mongoose.model('User', userSchema);
	Encounter = mongoose.model('Encounter', encounterSchema);  
	Login = mongoose.model('Login', loginSchema);  


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  	console.log('DB READY !!!');
});

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', function(req, res){
	console.log('index.html');
});

checkOnline = function() {
setTimeout(function(io) {
	if(io && io.sockets) {
		//console.log('send the server is online');
		io.sockets.emit('SERVER-IS-ONLINE')
	}
	checkOnline();
}, 5000, io);
};

io.on('connection', function(socket){
  socket.on('disconnect', function(){
	var query = Login.findOne({socketId: socket.id}).remove();
    query.exec(function(err, login) {
	     console.log('user-logged-out socketId by disconnect', socket.id);    	
		 if (!err) { 
		 	if(login) {
		 		io.emit('user-logged-out');
		 	}
		 }
	});
  });

  socket.on('log-out-user', function(data, fn){
	var query = Login.findOne({_id: data}).remove();
    console.log('user-logged-out socketId by client', data);
    query.exec(function(err, login) {
    	console.log('user-logged-out socketId by client', data);
		 if (!err) { 
		 	if(login) {
		 		io.emit('user-logged-out');
		 		fn('success');
		 	}
		 }
	});
  });


  /*
   * match-data
   */
  socket.on('get-live-matches', function(data, fn){   
	Match.find({}, function(err, matches){
		if(!err) {
			var response = [];
			_.forEach(matches, function(match) {
				if(!_.isEmpty(match.players)) { 
					var liveMatchData = {};
					liveMatchData.startDateTime = match.startDateTime;
					liveMatchData.players = match.players;
					liveMatchData.fkMatch = match.uid;
					liveMatchData.fkEncounter = match.fkEncounter;
					response.push(liveMatchData);
				}
			})
			fn(response);
		}
    });
  });

  socket.on('get-matches', function(data, fn){   
	Match.find({}, function(err, matches){
		if(!err) {
			fn(_.pluck(matches, 'uid'));
		}
    });
  });

  socket.on('get-match', function(data, fn){   

	var query = Match.findOne({uid: data.uid});
	query.exec(function(err, match){
		if(!err) {
			if(!_.isEmpty(match)) {
				fn(match);
			}	
		}
    });
  });

  socket.on('match-data', function(data, fn){
	var query = Match.findOne({uid: data.uid});

    query.exec(function(err, match) {
		 if (!err) {
			if(_.isEmpty(match)) {
		 		var matchIn = new Match(data);	
		 		matchIn.save(function (err, match) {
				if (!err) {
					io.emit('match-updated', match.uid);
				}
			});
		 	} else {
			    Match.findById(match._id, function (err, matchById) {
    				matchById.update(data).exec();
    				io.emit('match-updated', matchById.uid);
				});
		    } 		 	
		}	
	});
  });

  /*
   * register-user
   */
  socket.on('get-logged-in-users', function(data, fn){   
	Login.find({}, function(err, logins){
		if(!err) {
			fn(logins);
		}
    });
  });

  socket.on('get-registered-users', function(data, fn){   
	User.find({}, function(err, users){
		if(!err) {
			fn(users);
		}
    });
  });

  socket.on('register-user', function(data, fn){
	console.log('register-user');
	console.log(data);

	var query = User.findOne().or([{username: data.username}, {email: data.email}]);

    query.exec(function(err, user) {
		 if (!err) { 
		 		if(user) {
		 			fn({error: 'USER_OR_EMAIL_FOUND'});	
		 		} else {
					var newUser = new User(data);
					newUser.save(function (err, newUser) {
	  					if (!err) {
	  						console.log('user registered', newUser);
	  						io.emit('user-registered')
	   						fn(newUser);
	   					}
	   				});
		 		}
			}
		});
  });

  /*
   * team
   */
  socket.on('update-or-create-team', function(data, fn){
	var newTeam = new Team(data);
	newTeam.save(function (err, newTeam) {
	  if (!err) {
	  	fn(newTeam);
	  }
	});
  });

  socket.on('get-teams', function(data, fn){   
	Team.find({}, function(err, teams){
		if(!err) {
			fn(teams);
		}
    });
  });  

  /*
   * new-encounter
   */
  socket.on('get-encounter-matches', function(data, fn){   
	Match.find({fkEncounter: data}, function(err, matches){
		if(!err) {
			var response = [];
			console.log('-> GET', matches)
			_.forEach(matches, function(match) {
				if(!_.isEmpty(match.players)) { 
					var liveMatchData = {};
					liveMatchData.startDateTime = match.startDateTime;
					liveMatchData.players = match.players;
					liveMatchData.fkMatch = match.uid;
					liveMatchData.fkEncounter = match.fkEncounter;
					response.push(liveMatchData);
				}
			})
			fn(response);
		}
    });
  });

  socket.on('get-live-encounters', function(data, fn){   
	Encounter.find({}, function(err, encounters){
		if(!err) {
			fn(encounters);
		}
    });
  });

  socket.on('get-encounters', function(data, fn){   
	Encounter.find({}, function(err, encounters){
		if(!err) {
			fn(encounters);
		}
    });
  });

  socket.on('get-encounter', function(data, fn){   
	var query = Encounter.findOne({uid: data});
    query.exec(function(err, encounter) {
		 if (!err) { 
	   		fn(encounter);
	   	}	
	});
  });  

  socket.on('update-or-create-encounter', function(data, fn){
	var query = Encounter.findOne().or([{uid: data.uid}]);
    query.exec(function(err, encounter) {
		 if (!err) {
			if(_.isEmpty(encounter)) {
		 		var encounterIn = new Encounter(data);	
		 		encounterIn.save(function (err, encounter) {
				if (!err) {
					console.log(encounter.uid)
					io.emit('encounter-updated', encounter.uid);
				}
			});
		 	} else {
			    Encounter.findById(encounter._id, function (err, encounterById) {
    				encounterById.update(data).exec();
    				io.emit('encounter-updated', encounterById.uid);
				});
		    } 		 	
		}	
	});
  });


  /*
   * online-information
   */
  socket.on('re-login-user', function(data, fn){

  	Login.findOne({username: data.username}).remove().exec();

	var lData = {
		fkUser: data.userId,
		username: data.username,
		socketId: socket.id
	};
	var loggedIn = new Login(lData);	
	 			loggedIn.save(function (err, login) {
					if (!err) {
						io.emit('user-logged-in', lData);
						fn({
							info: 'LOGGED-IN',
							data: {
								id: login._id,
								userId: data.userId,
								username: data.username
							}
						});
					}	
				});	

  }); 

  socket.on('login-user', function(data, fn){
  	Login.findOne({username: data.username}).remove().exec();

	var query = User.findOne().and([{username: data.username}, {pw: data.pw}]);

    query.exec(function(err, user) {
		 if (!err) { 
		 		if(user) {
		 			var lData = {
		 				fkUser: user._id,
		 				username: user.username,
		 				socketId: socket.id
		 			};
		 			var loggedIn = new Login(lData);	
		 			loggedIn.save(function (err, login) {
						if (!err) {
							io.emit('user-logged-in', lData);
							fn({
								info: 'LOGGED-IN',
								data: {
									id: login._id,
									userId: user._id,
									username: user.username
								}
							});
						} else {
							fn({
								error: 'USER_LOGIN_ERROR'
							});
						}
					});
		 		} else {
		 			fn({error: 'WRONG_USERNAME_OR_PASSWORD'});	
		 		}
 	 	 } else {
		 	fn({error: err});	
		 }

	});
  }); 

  socket.on('send-pw', function(data, fn){
  	 var query = User.findOne({email: data});
     query.exec(function(err, user) {
		 if (!err) {
		    if(user) {
		 		sendPwMail(user.email, user.name, user.username, user.pw, fn);
		 	} else {
				fn({
					error: 'NO_SUCH_USER'
				});
			}
		 } else {
		 	fn({error: err});	
		 }
	  });
	  
  }); 

  /*
   * online-information
   */
  socket.on('online-information', function(data, fn){
	  fn('server online');
  });
});


sendPwMail = function(email, name, username, pw, fn) {
	var transporter = nodemailer.createTransport();
	var mailOptions = {
	    from: 'Dartmonster <octopus@dartmonster.de>',
	    to: email,
	    subject: 'Octopus :: Login :: ' + name,
	    text: 'name: ' + username + '\npassword: ' + pw
	};	
	transporter.sendMail(mailOptions, function	(error, info) {
		if(error)	 {
			fn({error: 'EMAIL-NOT-SENT'})
			return console.log(error);
		}
		fn({info: 'EMAIL-SENT'})
	});
}

server.listen(3000);
checkOnline();

