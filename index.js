'use strict';


var five = require("johnny-five");
var board = new five.Board();
var _ = require('lodash');

board.on("ready", function() {
    // Create an Led on pin 13
    var button = new five.Button(2);
    var led1 = new five.Led(11);
    var led2 = new five.Led(13);

    led2.blink(1500);
    led1.off();

    var state = false;

    button.on("hold", function() {
        state = !state;

        console.log(111, Date.now());

        if (state) {
            led1.on();
        } else {
            led1.off();
        }
    });
});