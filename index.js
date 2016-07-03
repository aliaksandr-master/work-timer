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

    const defaults = () => {
        console.log('SET DEFAULTS');
        led2.stop();
        led2.off();
        led1.stop();
        led1.off();
        led1.pulse({
            duration: 5000,
            cuePoints: [0,   0.5,   1],
            keyFrames: [0,   2,     0]
        });
    };

    const loop = Loop(board, 1, [
        () => {
            led1.pulse({
                duration: 1000,
                cuePoints: [0,   0.5,   1],
                keyFrames: [0,   30,     0]
            });
        },
        () => {
            led1.pulse({
                duration: 1000,
                cuePoints: [0,   0.5,   1],
                keyFrames: [0,   100,     0]
            });
            led2.blink(2500);
        }
    ], defaults);

    defaults();

    let offLoop = loop();

    button.on('hold', () => {
        console.log('!!!!');
        offLoop();

        offLoop = loop();
    });

    let counter = 0;
    setInterval(() => {
        console.log(++counter);
    }, 60 * 1000);


    board.on('exit', () => {
        led2.stop();
        led2.off();
        led1.stop();
        led1.off();
    })
});