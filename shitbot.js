// ==ClosureCompiler==
// @output_file_name shitbot.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @language ECMASCRIPT5_STRICT
// ==/ClosureCompiler==
/* global jQuery, _, API */

/**
 * A super basic version of the DnB Stats bot
 */
(function( $, _, plug )
{
	'use strict';
	if ( window.shitbot )
		window.shitbot.seppuku();
	var shitbot = window.shitbot = {
		version: '0.4',

		currentTrack: null,

		me: null,

		chats: 2, // you aint been spamming yet baby

		commands: {
			'die': function( userName, message, userID )
			{
				var user = plug.getUser( userID );
				if ( user.permission >= plug.ROLE.BOUNCER )
					this.seppuku();
				else
					this.doChat( 'YOU CAN\'T TELL ME WHAT TO DO @', userName.toUpperCase(), '!' );
			},
			'about': function( userName )
			{
				this.doChat( '@', userName, ': This is shitbot v', this.version, ' filling in the gaps until a better bot comes online.' );
			},
			'status': function()
			{
				this.doChat( 'Not great' );
			},
			'taco': function( userName )
			{
				this.doChat( '@', userName, ': Do I look like a chef?' );
			},
			'drink': function( userName )
			{
				this.doChat( '@', userName, ': Do I look like a barkeep?' );
			},
			// woop
			'info': function()
			{
				this.doChat( "No Dubstep or Skrillex! 8 minutes max each tune. We play DnB like Liquidfunk, Neurofunk, Jungle, Jump up or *Breaks* except Drumstep and Breakcore. Read about the genre we play here: http://en.wikipedia.org/wiki/Drum_and_bass" );
			},
			'rules': function()
			{
				this.doChat( "The only genres allowed here are DnB and Breakbeat except Drumstep and Breakcore. If a tune/mix is off-genre or involves Skrillex, it will be skipped. If a tune/mix is longer than 8 minutes, it will be skipped at the 8-minute mark. Also, have fun!" );
			},
			'whymeh': function()
			{
				this.doChat( "Please reserve Mehs for songs that are a) extremely overplayed b) off genre c) absolutely god awful or d) troll songs. If you simply aren't feeling a song, then please remain neutral." );
			}
		},

		doChat: function()
		{
			var message = _(arguments).toArray().join('');
			plug.sendChat( message );
			// plug.chatLog( message );
		},

		onRoomScoreUpdate: function( data )
		{
			console.log( 'on room score update', data );
			if ( ! data.positive )
				return;
			this.currentTrack = data;
		},

		onAdvance: function( data )
		{
			console.log( 'on advance', data );
			var message = [];
			if ( this.currentTrack ) {
				var track = this.currentTrack;
				this.currentTrack = null;
				var numusers = plug.getUsers().length - 2;
				message.push(
					'Last track got a ',
					Math.floor( ( track.positive / numusers ) * 100 ),
					'% approval rating'
				);
				if ( track.negative )
					message.push( ' with ', track.negative, ' mehs' );
				if ( track.curates )
					message.push( ' and ', track.curate, ' snatches' );
				message.push( '! ' );
			}
			this.doChat( message.join(''), 'Up Next: ', data.dj.username, ' with "', data.media.title, '" by ', data.media.author );
		},

		onCurate: function( data )
		{
			var title = 'this track';
			if ( this.chats > 4 )
				title = plug.getMedia().title;
			console.log( 'on Curate', data, title );
			this.doChat( data.user.username, ' snatched ', title, '!' );
		},

		onChat: function( data )
		{
			console.log( 'on chat', data );
			if ( data.fromID === this.me.id )
				this.chats = 0;
			else
				this.chats++;
			if ( ! this.chats || 'message' !== data.type )
				return;
			var message = data.message;
			if ( '.' === message && this.chats > 2 ) {
				this.doChat( '.' );
			}
			if ( ';' !== message.substring(0, 1) )
				return;
			var spaceLoc = message.indexOf(' ');
			if ( -1 === spaceLoc )
				spaceLoc = undefined;
			var cmd = message.substring( 1, spaceLoc );
			var command = this.commands[ cmd ];
			if ( command ) {
				command.call( this, data.from, spaceLoc ? message.substring( spaceLoc + 1 ) : '', data.fromID );
			}
		},

		onLoad: function()
		{
			console.log( 'on load' );
			this.me = plug.getUser();
			plug.on( plug.ROOM_SCORE_UPDATE, this.onRoomScoreUpdate, this );
			plug.on( plug.CURATE_UPDATE, this.onCurate, this );
			plug.on( plug.DJ_ADVANCE, this.onAdvance, this );
			plug.on( plug.CHAT, this.onChat, this );
			this.doChat( 'Shitbot v', this.version, ' now online! (Now with 50% less spam)' );
		},

		seppuku: function()
		{
			console.log( 'RIP' );
			plug.off( plug.ROOM_SCORE_UPDATE, this.onRoomScoreUpdate, this );
			plug.off( plug.CURATE_UPDATE, this.onCurate, this );
			plug.off( plug.DJ_AVDANCE, this.onAdvance, this );
			plug.off( plug.CHAT, this.onChat, this );
			this.doChat( 'Shitbot v', this.version, ' signing off. Bye!' );
		}
	};
	_.bindAll( shitbot, 'onLoad' );
	$( shitbot.onLoad );
	return shitbot;
})( jQuery, _, API );
