// get lat/lon for looking up trending topics

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random float between (greets to: http://snipplr.com/view/37687/random-number-float-generator/)
function randomFloatBetween(minValue,maxValue,precision){
    if(typeof(precision) == 'undefined'){
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)), maxValue).toFixed(precision));
}



var minLat = -90;
var maxLat = 90;
var minLon = -180;
var maxLon = 180;


var getRandomLon = function getRandomLon() {
    return randomFloatBetween(minLon, maxLon, 6);
};

var getRandomLat = function getRandomLat() {
    return randomFloatBetween(minLat, maxLat, 6);
};

var getRandomCoords = function getRandomCoords() {
    var coords = {};
    coords.lon = getRandomLon();
    coords.lat = getRandomLat();
    return coords;
};




module.exports = {
    getRandomCoords: getRandomCoords,
    getRandomLon: getRandomLon,
    getRandomLat: getRandomLat
};