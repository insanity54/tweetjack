var Twitter = require('twitter');
var Q = require('q');
var geo = require('./geo.js');


var twitter;
var tries = 3; // max times to try if got errors


var init = function init(key, secret, tokenKey, tokenSecret) {

    twitter = new Twitter({
        consumer_key: key,
        consumer_secret: secret,
        access_token_key: tokenKey,
        access_token_secret: tokenSecret,
    });
    
};


var begin = function begin() {
    
    var attemptNo = 0; // Counter for attempts. Compares to var tries
    
    (function b() {
        // get a random location
        // get nearest twitter location with trending topics
        Q
        .nfcall(twitter.get.bind(twitter, 'trends/closest', {lat: geo.getRandomLat(), long: geo.getRandomLon()}))
    
    
        // get the location id
        .then(function(res) {
                // the world place id (yahoo where on earth id http://developer.yahoo.com/geo/geoplanet/)
                var locationId = res[0][0].woeid || '23424916'; // use the woeid from the json response or fall back to New Zealand (23424916)
                console.log('>> got a location:', locationId);
                
                
                // next
                return Q.nfcall(twitter.get.bind(twitter, 'trends/place', {id: locationId}));
        })
        
        
        // get a trend from the location
        .then(function(trends) {
                    //var t = 
                    //console.log(trends);
                    var trend = trends[0][0].trends[0].query;
                    console.log('>> got a trend:', trend);
                    
                    // next
                    return Q.nfcall(twitter.get.bind(twitter, 'search/tweets', {q: trend, result_type: 'popular', count: 1}));
        })
    
        
        // find a popular tweet using the trend we found
        .then(function(tweets) {
            var tweet = tweets[0].statuses[0];
            console.log('>> tweet id:', tweet.id);
            console.log('>> tweet text:\n', tweet.text);
    
            // next
            return Q.nfcall(twitter.post.bind(twitter, 'statuses/update', {status: tweet.text}));
        })
        
        
        // do something when done
        .then(function(tweets, response) {
                //console.log(tweets);
                console.log('>> magick fulfilment!');
                return tweets;
        })
        
        
        // handle any errors
        .catch(function(err) {
            console.log('!! there was a magickal error:', err);
            console.log('attempt', attemptNo, 'tries', tries);
            if (attemptNo < tries) {
                attemptNo++;
                b(); // try again
            }
        });
    })();

};






module.exports = {
    init: init,
    begin: begin,
    start: begin,
    go: begin,
    run: begin
};