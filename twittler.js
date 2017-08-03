$(document).ready(function(){
  initialize();
  var previousIndex;

  function initialize(){
    var $body = $('body');
    $body.html('');
    $(document).off('click');
    $('<h1>Twittler</h1>').appendTo($body);
    $('<div class="newTweet"></div>').appendTo($body)
    $('<button>Update Feed</button>').appendTo('.newTweet');
    $('<ul></ul>').appendTo($body);
    var index = streams.home.length - 1;
    previousIndex = index;
    for (var i = 0; i < index; i++) {
      listTweet(i, 'home');
    }

    $('.newTweet').on('click', 'button', getNewTweet);

    $('ul').on('click', 'a', function() {
      var tweeter = $(this).text();
      console.log(streams.users[tweeter]);
      console.log(JSON.stringify(streams.users[tweeter]));
      console.log(streams.users[tweeter].length);
      userList(tweeter);
    });
    updateUI();
    autoUpdate();
  }

  function autoUpdate(){
    if (streams.home.length !== previousIndex){
      getNewTweet();
    }
    setTimeout(autoUpdate, 1000);
  }

  function userList(tweeter){
    var $body = $('body');
    $body.html('');
    $(document).off('click');
    $('<h1>Twittler</h1>').appendTo($body);
    $('<div class="newTweet"></div>').appendTo($body)
    $('<button>Update Feed</button>').appendTo('.newTweet');
    $('<div class="goBack"></div>').appendTo($body)
    $('<button>Go back</button>').appendTo('.goBack');
    $('<ul></ul>').appendTo($body);
    $('.goBack').on('click', 'button', initialize);
    // for (var i = streams.users[tweeter].length - 1; i >= 0; i--) {
    //   console.log(i)
    //   listTweet(i, 'users', tweeter);
    // }
  }

  function getNewTweet(){
    var index = streams.home.length - 1;
    var previous = previousIndex;
    previousIndex = index;
    while(index > previous){
      listTweet(index, 'home');
      index -=1;
      updateUI();
    }

  }

  function listTweet(index, homeOrUsers, tweeter){
    var $tweet = $('<li></li>');
    var timeStamp
    var tweet;
    if (homeOrUsers === 'home'){
      tweet = streams[homeOrUsers][index];
      $tweet.text(tweet.user);
      timeStamp = getTimeStamp(tweet)
    } else {
      tweet = streams[homeOrUsers][tweeter][index];
      $tweet.text(tweeter);
      timeStamp = getTimeStamp(tweeter);
    }
    $tweet.contents().wrap('<a class="tweeter" href="#"></a>');

    var before = timeStamp + ' @';
    var after = ': ' + tweet.message;
    $before = $('<span></span>')
    $before.text(before);
    $after = $('<span></span>')
    $after.text(after);
    $tweet.prepend($before);
    $tweet.append($after);

    // $tweet.text(timeStamp + ' @' + tweet.user + ': ' + tweet.message);
    $tweet.prependTo('ul').hide();
  }

  function getTimeStamp(tweeter){
    var date = tweeter.created_at;
    return '['
      + date.getMonth() + '/'
      + date.getDate() + '/'
      + date.getFullYear() + ' '
      + date.getHours() + ':'
      + ('0' + date.getMinutes()).slice(-2) + ':'
      + ('0' + date.getSeconds()).slice(-2) +']';
  }

  var flip = true;
  function updateUI(){
    $('li').fadeIn();
    if (flip) {
      $('li:odd').css({'background-color': 'rgba(61, 185, 199, 0.2)'});
      $('li:even').css({'background-color': 'white'});
      flip = false;
    } else {
      $('li:odd').css({'background-color': 'white'});
      $('li:even').css({'background-color': 'rgba(61, 185, 199, 0.2)'});
      flip = true;
    }
  }
});
