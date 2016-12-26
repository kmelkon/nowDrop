$(document).ready(function() {

    $( "#target" ).submit(function( event ) {
      NowDrop.userName = $('#lastfm-username').val();
    //   console.log(NowDrop.userName);
      $('#form-container').fadeOut("slow");
      event.preventDefault();
    });

    NowDrop.loop();

});


var NowDrop = {};
NowDrop.mainLoopTimer = 1000;
NowDrop.userName = '';

NowDrop.loop = function() {
    NowDrop.ajax();
   setTimeout(NowDrop.loop,NowDrop.mainLoopTimer);
};

NowDrop.ajax = function() {
    if (NowDrop.userName) {
        $.ajax({
            type: 'POST',
            url: 'http://ws.audioscrobbler.com/2.0/',
            data: 'method=user.getRecentTracks&' +
                // 'user=karam2melkon&' +
                'user=' + NowDrop.userName + '&' +
                'limit=1&' +
                'api_key=57ee3318536b23ee81d6b27e36997cde&' +
                'format=json',
            dataType: 'jsonp',
            success: function(data) {
                var htmlText = '';
                var songInfo = '';
                var oldSongInfo = '';
                var songAlbum = '';
                var songStatus = '';
                var songCoverElem = '';
                var songCoverImg = '';
                var pageTitle = '';
                var counter = 1; //workaround to show only the now playing song, thanks lastfm...

                $.each(data.recenttracks.track, function(i, item) {
                    if (counter === 1) {

                        // htmlText += '<div class="div-conatiner">';
                        songCoverImg += item.image[3]["#text"];
                        if (songCoverImg) {
                            songCoverElem += '<img src="' + songCoverImg + '" />';
                            var image = new Image();
                            image.src = songCoverImg;
                            image.onload = function () {
                            //    $('#song-coverart').html(songCoverElem);
                               $('#song-coverart img').attr("src", songCoverImg);
                            //    $("#song-coverart img").fadeOut(500, function() {
                            //        $("#song-coverart img").attr("src",songCoverImg);
                            //    }).fadeIn(500);

                            }
                        } else {
                            var url = encodeURI("https://api.spotify.com/v1/search?query=" + item.name + " - " + item.artist['#text'] + "&offset=0&limit=1&type=track,artist");
                            $.get(url, function(data) {
                            // Set cover image if one is found
                                if (data.tracks.total > 0) {
                                    songCoverElem = '<img src="' + data.tracks.items[0].album.images[1].url + '" />';
                                    $('#song-coverart').html(songCoverElem)
                                }
                            });
                        }

                        $('#main-container').css('background-image', 'url("' + item.image[3]["#text"] + '")');
                        // $('section.hero').css('background-image', 'url("' + item.image[3]["#text"] + '")');
                        //if no image#text then look for that artist's picture.
                        //Then in later versions maybe pull the song's cover from Spotify
                        songInfo += '<a href="' + item.url + '">' + item.name;
                        songInfo += ' - ' + item.album['#text'] + '</a>';

                        $('#song-name').html(songInfo);
                        pageTitle = item.name + ' - ' + item.album['#text'];
                        songAlbum += item.artist['#text'];
                        if (item["@attr"]) {
                        // now playing or last played depending on the variable
                            songStatus += ' Now Playing ';
                        } else {
                            songStatus += ' Last Played ';
                        }
                        // htmlText += '</div>';

                    }
                    counter++;
            });
            // $('#song-coverart').html(songCoverElem);
            document.title = pageTitle;
            $('#song-status').html(songStatus);
            // $('#song-name').html(songInfo);
            $('#song-album').html(songAlbum);

          },
          error: function(code, message) {
             $('#error').html('Error Code: ' + code + ', Error Message: ' + message);
         }
        });
    }

}

//save the username locally and change the url
//make Page Title dynamic
