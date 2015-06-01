var Twitter = require('twitter');
var Q = require('q');
var geo = require('./geo.js');


var begin = function begin(key, secret, tokenKey, tokenSecret) {

    
    var twitter = new Twitter({
        consumer_key: key,
        consumer_secret: secret,
        access_token_key: tokenKey,
        access_token_secret: tokenSecret,
    });
    
    
    
    
    // get a random location
    // get nearest twitter location with trending topics
    Q
    .nfcall(twitter.get.bind(twitter, 'trends/closest', {lat: geo.getRandomLat(), long: geo.getRandomLon()}))


    // get the location id
    .then(function(res) {
            // the world place id (yahoo where on earth id http://developer.yahoo.com/geo/geoplanet/)
            var locationId = res[0][0].woeid || '23424916'; // use the woeid from the json response or fall back to New Zealand (23424916)
            //return locationId;
            
            
            // next
            return Q.nfcall(twitter.get.bind(twitter, 'trends/place', {id: locationId}));
    })
    
    
    // get a trend from the location
    .then(function(trends) {
                //var t = 
                //console.log(trends);
                var trend = trends[0][0].trends[0].query;
                console.log('got a trend', trend);
                
                // next
                return Q.nfcall(twitter.get.bind(twitter, 'search/tweets', {q: trend, result_type: 'popular', count: 1}));
    })

    
    // find a popular tweet using the trend we found
    .then(function(tweets) {
        var tweet = tweets[0].statuses[0];
        console.log(tweets[0].statuses[0].text);
        console.log('tweet text:', tweet.text);
        //console.log(tweets[0].statuses[0]);
        
        // next
        return Q.nfcall(twitter.post.bind(twitter, 'statuses/update', {status: tweet.text}));
    })
    
    
    // do something when done
    .then(function(tweets, response) {
            //console.log(tweets);
            console.log('fulfilled');
            return tweets;
    })
    
    
    // handle any errors
    .catch(function(err) {
        console.log('there was an error', err);
    });


};






module.exports = {
    begin: begin,
    start: begin,
    go: begin,
    run: begin
};