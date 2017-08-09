$(document).ready(function(){

  var $body = $('body');
  var previousLength = {};
  var globalVariables = {
    'autoUpdateToggle' : true,
    'selectedUser' : undefined,
    'flip' : true,
    previousLengths : {}
  }
  initialize();

  function initialize () {
    var user = userOrHome();
    setUpDOM();
    listAllTweets();
    addEventListeners();
    autoUpdateFeed();
    autoUpdateTimeStamp();
  }

  function setUpDOM (user) {
    $body.html('');
    $(document).off('click');
    $('<h1>Twittler</h1>').appendTo($body);

    // add button for manual update
    $('<div id="newTweet"><button>Update Feed</button></div>').appendTo($body);

    // add button to toggle auto update
    $('<div class="autoFeedToggle"></div>').appendTo($body)
    $('<button><span>Feed Update : ON</span></button>').appendTo('.autoFeedToggle');

    // if user specified, then run setUpDOMForUser
    if (globalVariables.selectedUser) {
      setUpDOMForUser(globalVariables.selectedUser);
    }

    // add ul for the tweets to be prepended to
    $('<ul></ul>').appendTo($body);
  }

    function setUpDOMForUser () {
      //Append @user next to the title
      $('h1').text('Twittler @' + globalVariables.selectedUser);

      //Append the go Back Button
      $('<div id="goBack"><button>Go back</button></div>').appendTo($body);
    }

  function listAllTweets () {
    var user = userOrHome();
    iterateThroughTweets(user);
  }

  function iterateThroughTweets (user, startIdx) {
    // Purpose: To go through all the tweets with given parameters,
    //           and send the individual tweets to addOneTweetToDOM
    // input: username or home, the total number of messages, the index from which to start adding the tweet
    // output: none

    // First determine whether this is for ALL tweets or Specific user
    // Start adding tweets from the previous index to the last index
    // .slice(previous, index)
    // And _.each for all of them

    arrTweets = retrieveTweets(user);

    var newTweets = arrTweets.slice(startIdx || 0, arrTweets.length);

    _.each(newTweets, function (tweetObj, index) {
      addOneTweetToDOM(tweetObj);
      updateUI();
    });

    globalVariables.previousLengths[user] = arrTweets.length;
  }

  function retrieveTweets (user) {
    if (user === 'home') {
      return streams.home
    }
    return streams.users[user];
  }

    function addOneTweetToDOM (tweetObj) {
      // Purpose: To prepend one tweet of one user to the DOM
      // input: username or home, the given index
      // output: none

      //Format the tweet
      //Append to the DOM
      var $tweet = $('<li></li>');
      var tweet = formatTweet(tweetObj.user, tweetObj.message, tweetObj.created_at);
      _.each(tweet, function (tweetProperty) {
        $tweet.append(tweetProperty);
      });
      $tweet.prependTo('ul').hide();
    }

      function formatTweet (username, message, timeStamp) {
        // Purpose: To put the all info into a nice string
        // format should be '[timesStamp] @username : message'
        // timeStamp needs its own tags with a class for autoUpdater to find

        var usernameLink = $('<a />').attr({class : 'tweeter', href : '#'}).html(username);
        var formattedTime = formatTimeStamp(timeStamp);
        var humanTime = $('<span />').attr('id', 'humanTime').data('dateData', timeStamp).html('[' + formattedTime[0] + '] @');
        message = ': ' + message;

        return [humanTime, usernameLink, message];

      }

        function formatTimeStamp (timeStamp) {
          var humanTime = moment(timeStamp).fromNow();

          var numTime = timeStamp.getMonth() + '/'
            + timeStamp.getDate() + '/'
            + timeStamp.getFullYear() + ' '
            + timeStamp.getHours() + ':'
            + ('0' + timeStamp.getMinutes()).slice(-2) + ':'
            + ('0' + timeStamp.getSeconds()).slice(-2);

          return [humanTime, numTime];
        }

  function addEventListeners () {
    // Purpose: put all event listener into one container

    // Event listeners for : Manual update, auto update toggle, username, and if
    //    user page, go back.

    //Manual Update Button
    $('#newTweet').on('click', 'button', function (event) {
      defaultEventSettings(event);
      updateFeed();
    });

    //Auto Update Toggle
    $('.autoFeedToggle').on('click', 'button', function (event) {
      defaultEventSettings(event);
      toggleAutoFeed();
    });

    //Username Click
    $('ul').on('click', 'a', function(event) {
      defaultEventSettings(event);
      var user = $(this).text();
      globalVariables.selectedUser = user;
      initialize();
    });

    //Go Back Button
    $('#goBack').on('click', 'button', function(event) {
      defaultEventSettings(event);
      globalVariables.selectedUser = undefined;
      initialize();
    });

    function defaultEventSettings(event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function checkForNewTweets () {
    //input: username or home
    //output: boolean

    //check the difference in previous length of the userOrHome and current length
    var user = userOrHome();
    var tweets = retrieveTweets(user);
    if (globalVariables.previousLengths[user] !== tweets.length) {
      return true;
    }
    return false;
  }

  function toggleAutoFeed () {
    if (globalVariables.autoUpdateToggle) {
      globalVariables.autoUpdateToggle = false;
      $('.autoFeedToggle span').text('Feed Update: OFF');

    } else {
      globalVariables.autoUpdateToggle = true;
      $('.autoFeedToggle span').text('Feed Update: ON');
      autoUpdateFeed();
    }
  }

  function autoUpdateFeed () {
    updateFeed();

    if (globalVariables.autoUpdateToggle === true) {
      setTimeout(function () {
        autoUpdateFeed();
      }, 1000);
    }
  }

    function updateFeed () {
      // Purpose: If there any changes in the home or username length, run iterateThroughTweets
      var user = userOrHome();
      var areThereNewTweets = checkForNewTweets(user);

      if (areThereNewTweets) {
        iterateThroughTweets(user, globalVariables.previousLengths[user]);
      }
    }

  function userOrHome(){
    if (globalVariables.selectedUser) {
      return globalVariables.selectedUser;
    }
    return 'home';
  }

  function autoUpdateTimeStamp() {
    updateTimeStamp();
    setTimeout(autoUpdateTimeStamp, 1000);
  }

    function updateTimeStamp () {
      
      var timeStamps = $('ul li #humanTime');

      _.map(timeStamps, function (span) {
        var date = $(span);
        var dateData = date.data('dateData')
        var humanTime = formatTimeStamp(dateData);
        var newTime = '[' + humanTime[0] + '] @';
        if (date.text() !== newTime) {
          $(span).fadeOut(500, function() {
            $(this).html(newTime).fadeIn(500);
          });
        }
      });
    }

  function updateUI(){
    $('li').fadeIn();
    if (globalVariables.flip) {
      $('li:odd').css({'background-color': 'rgba(61, 185, 199, 0.2)'});
      $('li:even').css({'background-color': 'white'});
      globalVariables.flip = false;
    } else {
      $('li:odd').css({'background-color': 'white'});
      $('li:even').css({'background-color': 'rgba(61, 185, 199, 0.2)'});
      globalVariables.flip = true;
    }
  }
});
