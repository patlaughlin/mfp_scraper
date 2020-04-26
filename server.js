var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var player = require('play-sound')(opts = {});

var url = 'https://www.repfitness.com/bars-plates/olympic-plates/iron-plates/rep-iron-plates';

const interval = setInterval(() => {

    request(url, function (error, response, html) {
        if (error) {
            throw error;
        }

        var $ = cheerio.load(html);
        if ($.html().includes('iron plates')) {
            player.play('jiggy.mp3', err => {
                if (err) throw err;
            });
            clearInterval(interval);
            console.log('found it')
        }
    });

}, 6000);
