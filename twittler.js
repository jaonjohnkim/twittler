$(document).ready(function(){
  var autoFeedToggle = true;
  initialize();
  var previousIndex;
  var specifiedTweeter;
  var userSpecifiedPreviousIndex = {};

  function initialize(){
    setUpDOM();
    var index = streams.home.length - 1;
    previousIndex = index;
    for (var i = 0; i < index; i++) {
      listTweet(i, 'home');
    }

    $('ul').on('click', 'a', function(event) {
      event.preventDefault();
      event.stopPropagation();
      var tweeter = $(this).text();
      specifiedTweeter = tweeter;
      userList(tweeter);
    });
    updateUI();
    autoUpdate();
  }

  function autoUpdate(){
    console.log(autoFeedToggle)
    if (autoFeedToggle) {
      if (streams.home.length !== previousIndex && specifiedTweeter === undefined){
        getNewTweet();
      } else if (specifiedTweeter) {
        getNewTweet(specifiedTweeter);
      }
      setTimeout(autoUpdate, 1000);
    }
  }

  function userList(tweeter){
    setUpDOM(tweeter);
    var index = streams.users[tweeter].length - 1;
    userSpecifiedPreviousIndex[tweeter] = index;
    for (var i = 0; i < index; i++) {
      listTweet(i, 'users', tweeter);
    }
    updateUI();
  }

  function setUpDOM(tweeter){
    var $body = $('body');
    $body.html('');
    $(document).off('click');
    if (tweeter === undefined) {
      $('<h1>Twittler</h1>').appendTo($body);
    } else {
      $('<h1>Twittler @' + tweeter + '</h1>').appendTo($body);
    }
    $('<div class="newTweet"></div>').appendTo($body)
    $('<button>Update Feed</button>').appendTo('.newTweet');

    $('.newTweet').on('click', 'button', function (event) {
      event.preventDefault();
      event.stopPropagation();
      getNewTweet(tweeter);
    });
    autoFeedToggle = true;
    $('<div class="autoFeedToggle"></div>').appendTo($body)
    $('<button><span>Feed Update : ON</span></button>').appendTo('.autoFeedToggle');
    $('.autoFeedToggle').on('click', 'button', function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (autoFeedToggle) {
        autoFeedToggle = false;
        $('.autoFeedToggle span').text('Feed Update: OFF');
      } else {
        autoFeedToggle = true;
        $('.autoFeedToggle span').text('Feed Update : ON');
        autoUpdate();
      }
    });

    if(tweeter !== undefined){
      $('<div class="goBack"></div>').appendTo($body);
      $('<button>Go back</button>').appendTo('.goBack');
      $('.goBack').on('click', 'button', function(event) {
        event.preventDefault();
        event.stopPropagation();
        specifiedTweeter = undefined;
        initialize();
      });
    }
    $('<ul></ul>').appendTo($body);
  }

  function getNewTweet(tweeter){
    var index;
    var previous;
    if (tweeter === undefined) {
      index = streams.home.length - 1;
      previous = previousIndex;
      previousIndex = index;
      iterateThroughTweets(index, previous, 'home');
    } else {
      index = streams.users[tweeter].length - 1;
      previous = userSpecifiedPreviousIndex[tweeter];
      userSpecifiedPreviousIndex[tweeter] = index;
      iterateThroughTweets(index, previous, 'users', tweeter);
    }
  }

  function iterateThroughTweets(index, previous, homeOrUsers, tweeter){
    while(index > previous){
      listTweet(index, homeOrUsers, tweeter);
      index -=1;
      updateUI();
    }
  }

  function listTweet(index, homeOrUsers, tweeter){
    var $tweet = $('<li></li>');
    var timeStamp
    var tweet;
    if (homeOrUsers === 'home'){
      tweet = streams.home[index];
      $tweet.text(tweet.user);
    } else if (homeOrUsers === 'users') {
      tweet = streams.users[tweeter][index];
      $tweet.text(tweeter);
    }
    timeStamp = getTimeStamp(tweet);
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
