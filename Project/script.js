"use strict";

function createSynthVoice(voiceType) {
    const oscillator = new Pizzicato.Sound({
        source: 'wave',
        options: {
            type: voiceType,
            frequency: 220
        }
    });

    return oscillator
}

function main() {
    console.log("main loop")
}

window.onload = main;