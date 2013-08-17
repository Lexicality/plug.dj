// ==ClosureCompiler==
// @output_file_name playlists.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @language ECMASCRIPT5_STRICT
// ==/ClosureCompiler==
/* global require */

require( [ 'underscore', 'app/store/LocalStorage', 'jquery' ], function( _, ls, $ )
{
    'use strict';
    var playlists = JSON.parse( ls.getItem('playlist') );
    // var media = JSON.parse( ls.getItem( 'media' ) );
    var $dumper = $('<div>', {
        'id': 'playlist-dumper',
        'css': {
            'position': 'absolute',
            'top': '10%',
            'left': '10%',
            'width': '80%',
            'height': '80%',
            'background': 'rgba(50, 50, 50, 0.9)',
            'border': '5px solid white',
            'z-index': 50,
            'overflow': 'auto'
        }
    })
    .appendTo('body')
    .append(
        $('<button>', {
            html: '&times;',
            css: {
                'position': 'absolute',
                'top': '10px',
                'right': '10px'
            }
        })
        .on('click', function() {
            $dumper.remove();
        } )
    );
    _.each( playlists, function( playlist )
    {
        var links = _(playlist.items).chain().filter(function(item)
        {
            return '1' === item.substr(0, 1);
        })
        .map(function( item )
        {
            // if ( item.substr(0, 1) == '1' )
                return item.substr(2);
            // else
            //     return '';
            // var type = item.substr(0, 1);
            // var id = item.substr(2);
            // var details = media[ item ] || media[ id ] || {};
            // var name = details.author + ' - ' + details.title;
            // var url;
            // if ( '1' === type ) {
            //     url = "http://youtu.be/" + id;
            // } else if ( '2' === type ) {
            //     url = "soundcloud: " + id;
            // } else {
            //     url = "wtf? " + id;
            // }
            // return [name, url];
        } ).value();
        // console.log(playlist.name);
        // console.log( _.compact( links ).join(', ') );
        // return;
        // var $ul = $('<ol>', {
        //     css: {
        //         'list-style': 'none'
        //     }
        // });
        // _.each( links, function( link )
        // {
        //     $ul.append( $('<li>').append( $('<a>').text(link[0]).attr('href', link[1]) ) );
        // } );
        $dumper.append( $('<h1>').text(playlist.name), $('<p>').text( links.join(', ') )/*, $ul*/ );
        // console.log( playlist.name, links );
    } );
});