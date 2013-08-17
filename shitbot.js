// ==ClosureCompiler==
// @output_file_name shitbot.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @language ECMASCRIPT5_STRICT
// ==/ClosureCompiler==
/* global jQuery, _, API */

(function( $, _, plug )
{
	'use strict';
	if ( window.shitbot )
		window.shitbot.seppuku();
	var shitbot = window.shitbot = {
		currentTrack: null,

		me: null,

		chats: 2, // you aint been spamming yet baby

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
			if ( this.currentTrack ) {
				this.doChat( 'Last track got ', this.currentTrack.positive, ' woots, ', this.currentTrack.negative, ' mehs and ', this.currentTrack.curates, ' snatches!'  );
				this.currentTrack = null;
			}
			this.doChat( 'Up Next: ', data.dj.username, ' with "', data.media.title, '" by ', data.media.author );
		},

		onCurate: function( data )
		{
			var title = 'this track';
			if ( this.chats > 1 )
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
		},

		onLoad: function()
		{
			console.log( 'on load' );
			this.me = plug.getUser();
			plug.on( plug.ROOM_SCORE_UPDATE, this.onRoomScoreUpdate, this );
			plug.on( plug.CURATE_UPDATE, this.onCurate, this );
			plug.on( plug.DJ_ADVANCE, this.onAdvance, this );
			plug.on( plug.CHAT, this.onChat, this );
		},

		seppuku: function()
		{
			plug.off( plug.ROOM_SCORE_UPDATE, this.onRoomScoreUpdate, this );
			plug.off( plug.CURATE_UPDATE, this.onCurate, this );
			plug.off( plug.DJ_AVDANCE, this.onAdvance, this );
			plug.off( plug.CHAT, this.onChat, this );
		}
	};
	_.bindAll( shitbot, 'onLoad' );
	$( shitbot.onLoad );
	return shitbot;
})( jQuery, _, API );
