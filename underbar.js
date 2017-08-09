(function() {
  'use strict';

  window._ = {};

  // Returns whatever value is passed as the argument. This function doesn't
  // seem very useful, but remember it--if a function needs to provide an
  // iterator when the user does not pass one in, this will be handy.
  _.identity = function(val) {
    return val;
  };

  /**
   * COLLECTIONS
   * ===========
   *
   * In this section, we'll have a look at functions that operate on collections
   * of values; in JavaScript, a 'collection' is something that can contain a
   * number of values--either an array or an object.
   *
   *
   * IMPORTANT NOTE!
   * ===========
   *
   * The .first function is implemented for you, to help guide you toward success
   * in your work on the following functions. Whenever you see a portion of the
   * assignment pre-completed, be sure to read and understand it fully before
   * you proceed. Skipping this step will lead to considerably more difficulty
   * implementing the sections you are responsible for.
   */

  // Return an array of the first n elements of an array. If n is undefined,
  // return just the first element.
  _.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  // Like first, but for the last elements. If n is undefined, return just the
  // last element.
  _.last = function(array, n) {
    if (n > array.length){
      return array;
    }
    return n === undefined ? array[array.length - 1] : array.slice(array.length - n, array.length)
  };

  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  //
  // Note: _.each does not have a return value, but rather simply runs the
  // iterator function over each item in the input collection.
  _.each = function(collection, iterator) {
    if (Array.isArray(collection)){
      for (var i = 0; i < collection.length; i++){
        var value = collection[i];
        iterator(value, i, collection);
      }
    } else {
      for(var key in collection){
        var value = collection[key];
        iterator(value, key, collection);
      }
    }
  };

  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function(array, target){
    // TIP: Here's an example of a function that needs to iterate, which we've
    // implemented for you. Instead of using a standard `for` loop, though,
    // it uses the iteration helper `each`, which you will need to write.
    var result = -1;

    _.each(array, function(item, index) {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {
    var array = [];
    _.each(collection, function(item){
      if (test(item)){
        array.push(item);
      }
    });
    return array;
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    // TIP: see if you can re-use _.filter() here, without simply
    // copying code in and modifying it
    return _.filter(collection, function(item){
      return !test(item);
    });
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function(array) {
    var duplFreeArr = [];

  //Using _.each
    _.each(array, function(value){
      if (_.indexOf(duplFreeArr, value) === -1){
        duplFreeArr.push(value);
      }
    });

  //Using _.filter
    _.filter(array, function(value){
      if (_.indexOf(duplFreeArr, value) === -1){
        duplFreeArr.push(value);
        return true;
      }
      return false;
    });

    return duplFreeArr;
  };


  // Return the results of applying an iterator to each element.
  _.map = function(collection, iterator) {
    // map() is a useful primitive iteration function that works a lot
    // like each(), but in addition to running the operation on all
    // the members, it also maintains an array of results.
    var array = [];

    for (var i = 0; i < collection.length; i++){
      var value = collection[i];
      array.push(iterator(value, i, collection));
    }

    return array;
  };

  /*
   * TIP: map is really handy when you want to transform an array of
   * values into a new array of values. _.pluck() is solved for you
   * as an example of this.
   */

  // Takes an array of objects and returns an array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = function(collection, key) {
    // TIP: map is really handy when you want to transform an array of
    // values into a new array of values. _.pluck() is solved for you
    // as an example of this.
    return _.map(collection, function(item){
      return item[key];
    });
  };

  // Reduces an array or object to a single value by repetitively calling
  // iterator(accumulator, item) for each item. accumulator should be
  // the return value of the previous iterator call.
  //
  // You can pass in a starting value for the accumulator as the third argument
  // to reduce. If no starting value is passed, the first element is used as
  // the accumulator, and is never passed to the iterator. In other words, in
  // the case where a starting value is not passed, the iterator is not invoked
  // until the second element, with the first element as its second argument.
  //
  // Example:
  //   var numbers = [1,2,3];
  //   var sum = _.reduce(numbers, function(total, number){
  //     return total + number;
  //   }, 0); // should be 6
  //
  //   var identity = _.reduce([5], function(total, number){
  //     return total + number * number;
  //   }); // should be 5, regardless of the iterator function passed in
  //          No accumulator is given so the first element is used.
  _.reduce = function(collection, iterator, accumulator) {
    var newCollection = collection;
    if (accumulator === undefined){
      accumulator = collection[0];
      newCollection = collection.slice(1, collection.length);
    }
    _.each(newCollection, function(value){
      accumulator = iterator(accumulator, value);
    });
    return accumulator;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    // TIP: Many iteration problems can be most easily expressed in
    // terms of reduce(). Here's a freebie to demonstrate!
    return _.reduce(collection, function(wasFound, item) {
      if (wasFound) {
        return true;
      }
      return item === target;
    }, false);
  };


  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator) {
    return _.reduce(collection, function(anyFalse, item) {
      if (!anyFalse){
        return false;
      }
      if (iterator){
        return iterator(item) ? true : false;
      } else {
        return item ? true : false;
      }
    }, true);
  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function(collection, iterator) {
    // TIP: There's a very clever way to re-use every()
    if(iterator === undefined){
      iterator = _.identity;
    }
    for (var i = 0; i < collection.length; i++){
      if (iterator(collection[i])){
        return true;
      }
    }
    return false;
  };


  /**
   * OBJECTS
   * =======
   *
   * In this section, we'll look at a couple of helpers for merging objects.
   */

  // Extend a given object with all the properties of the passed in
  // object(s).
  //
  // Example:
  //   var obj1 = {key1: "something"};
  //   _.extend(obj1, {
  //     key2: "something new",
  //     key3: "something else new"
  //   }, {
  //     bla: "even more stuff"
  //   }); // obj1 now contains key1, key2, key3 and bla
  _.extend = function(obj) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]){
        arguments[0][key] = arguments[i][key];
      }
    }
    return arguments[0];
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]){
        if (arguments[0][key] === undefined){
          arguments[0][key] = arguments[i][key];
        }
      }
    }
    return arguments[0];
  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;

    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // infromation from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

  // Memorize an expensive function's results by storing them. You may assume
  // that the function only takes primitives as arguments.
  // memoize could be renamed to oncePerUniqueArgumentList; memoize does the
  // same thing as once, but based on many sets of unique arguments.
  //
  // _.memoize should return a function that, when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  _.memoize = function(func) {
    var results = {};
    return function(){
      var sArg = JSON.stringify(arguments);
      if (results.hasOwnProperty(sArg)) {
        return results[sArg];
      } else {
        results[sArg] = func.apply(null, arguments);
        return results[sArg];
      }
    }
  };


  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait) {
    var arg = [].slice.call(arguments, 2);
    return setTimeout(function(){
        return func.apply(this, arg);
    }, wait);

  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Randomizes the order of an array's contents.
  //
  // TIP: This function's test suite will ask that you not modify the original
  // input array. For a tip on how to make a copy of an array, see:
  // http://mdn.io/Array.prototype.slice
  _.shuffle = function(array) {
    var temp = array.slice(0);
    var newArr = [];
    while (temp.length > 0){
      var value = Math.floor(Math.random()*(temp.length - 1));
      newArr.push(temp.splice(value,1)[0]);
    }
    return newArr;
  };


  /**
   * ADVANCED
   * =================
   *
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */

  // Calls the method named by functionOrKey on each value in the list.
  // Note: You will need to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, args) {

    var newCollection = _.map(collection, function(value){
      if (value[functionOrKey] !== undefined){
        return value[functionOrKey]();
      }
      return functionOrKey.apply(value);
    });

    return newCollection;
  };

  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {
    return collection.sort(function(a, b) {
      if (a[iterator] !== undefined){
        var criteriaA = a[iterator];
        var criteriaB = b[iterator];
      } else {
        var criteriaA = iterator(a);
        var criteriaB = iterator(b);
      }

      if (criteriaA < criteriaB) {
        return -1;
      }
      if (criteriaA > criteriaB) {
        return 1;
      }
      return 0;
    });
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
    var array = [];
    var longestArrLength = 0;

    for (var k = 0; k < arguments.length; k++) {
      if (arguments[k].length > longestArrLength){
        longestArrLength = arguments[k].length;
      }
    }

    for (var i = 0; i < longestArrLength; i++){
      var newArr = [];
      for (var j = 0; j < arguments.length; j++) {
        newArr.push(arguments[j][i]);
      }
      array.push(newArr);
    }
    return array;
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
    var array = [];
    for (var i = 0; i < nestedArray.length; i++){
      if (Array.isArray(nestedArray[i])){
        var values = _.flatten(nestedArray[i]); //I'm super proud of this!!
        array = array.concat(values);
      } else {
        array.push(nestedArray[i]);
      }
    }

    return array;
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function() {
    var intersect = [];
    var firstArr = arguments[0];
    var secondArr = arguments[1];

    for (var j = 0; j < firstArr.length; j++) {
      for (var k = 0; k < secondArr.length; k++) {
        if (firstArr[j] === secondArr[k]){
          intersect.push(firstArr[j]);
        }
      }
    }
    for (var i = 2; i < arguments.length; i++) {
      for (var a = 0; a < arguments[i].length; a++) {
        for (var b = 0; b < intersect.length; b++) {
          if (intersect[b] !== arguments[i][a]){
            intersect.splice(b, 1);
            b--;
          }
        }
      }
    }
    return intersect;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var sameArr = array.slice();
    var overlap = [];
    for (var i = 1; i < arguments.length; i++) {
      for (var j = 0; j < sameArr.length; j++) {
        for (var k = 0; k < arguments[i].length; k++) {
          if (sameArr[j] === arguments[i][k]) {
            sameArr.splice(j, 1);
            j--;
          }
        }
      }
    }
    return sameArr;
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.  See the Underbar readme for extra details
  // on this function.
  //
  // Note: This is difficult! It may take a while to implement.
  _.throttle = function(func, wait) {
    //set closure variable
    //return function
      //if first time
        //start timer
        //execute function
      //else
        // get current time
        // if current time exceeds or equals timer + wait
          //reset the timer
          //execute function
      //end
    var timer;

    return function () {
      if (timer === undefined) {
        console.log('First time fn runs');
        timer = new Date();
        timer = timer.getSeconds()*1000 + timer.getMilliseconds();
        func.apply(this, arguments);
      } else {
        // console.log('After first time fn runs');
        var current = new Date();
        current = current.getSeconds()*1000 + current.getMilliseconds();
        console.log('Current time: ' + current);
        console.log('Start time: ' + timer);
        console.log('Minimum wait time: ' + (timer + wait));
        if (current >= (timer + wait)) {
          console.log('RAN!')
          timer = current;
          func.apply(this, arguments);
        }
      }
    }
  };
}());