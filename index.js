'use strict';


const five = require('johnny-five');
const board = new five.Board();
const _ = require('lodash');

const wait = (board, hourCount, handler) => {
    let active = true;

    board.wait(hourCount * 60 * 60 * 1000, () => {
        if (!active) {
            return;
        }

        handler();
    });

    return () => {
        active = false;
    };
};

const Loop = (board, base, handlers, done) =>
    () => {
        const offs = handlers.map((handler, index) =>
            wait(board, base * (index + 1), () => {
                handler();
            })
        );

        return () => {
            offs.forEach((off) => {
                off();
            });

            done();
        }
    };

board.on('ready', () => {
    var button = new five.Button(2);
    var led1 = new five.Led(11);
    var led2 = new five.Led(13);

    led2.off();
    led1.off();

    const loop = Loop(board, 0.5, [
        () => {
            led1.blink(2000);
        },
        () => {
            led2.blink(1000);
        }
    ], () => {
        led2.off();
        led1.off();
    });

    let offLoop = loop();

    button.on('hold', () => {
        offLoop();

        offLoop = loop();
    });
});