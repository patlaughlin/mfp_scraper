var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var player = require('play-sound')(opts = {});

var url = 'https://www.repfitness.com/bars-plates/olympic-plates/iron-plates/rep-iron-plates';
const time = 60000;

console.log(`Checking every ${time} milliseconds`);
const interval = setInterval(() => {

    request(url, function (error, response, html) {
        if (error) {
            throw error;
        }

        var $ = cheerio.load(html);
        var shop = $('.product-shop').html();
        if ([
            'add to cart',
            'purchase',
            'buy',
        ].some(el => {
            return shop.toLowerCase().includes(el)
        })) {
            player.play('jiggy.mp3', err => {
                if (err) throw err;
            });
            console.log('BUY NOW!');
            console.log('BUY NOW!');
            console.log('BUY NOW!');
            console.log('BUY NOW!');
            console.log('BUY NOW!');
            clearInterval(interval);
        } else {
            console.log('Not yet...');
            console.log('Checking again soon...');
        }
    });

}, time);
