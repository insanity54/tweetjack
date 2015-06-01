var nconf = require('nconf');
var tweetjack = require('./lib/tweetjack');
var schedule = require('node-schedule');

nconf.file('config.json');

var key = nconf.get('TWITTER_CONSUMER_KEY') || null;
var secret = nconf.get('TWITTER_CONSUMER_SECRET') || null;
var tokenKey = nconf.get('TWITTER_ACCESS_TOKEN_KEY') || null;
var tokenSecret = nconf.get('TWITTER_ACCESS_TOKEN_SECRET') || null;




if (key == null ||
    secret == null ||
    tokenKey == null ||
    tokenSecret == null) {
    throw new Error('The twitter config in config.json is invalid. One of the values ' +
        '(TWITTER_CONSUMER_KEY|TWITTER_CONSUMER_SECRET|TWITTER_ACCESS_TOKEN_KEY|TWITTER_ACCESS_TOKEN_SECRET) was missing');
}


tweetjack.init(key, secret, tokenKey, tokenSecret);


schedule.scheduleJob('8 * * * *', function(){
    console.log('>> tweeting the magick!');
    tweetjack.run();
});

