"use strict";
// Catch me never coding pure javascript ever again..

// Base note-frequency pairs for octave based at middle C
let note_pairs = {
    "C": 261.6256,
    "Db": 277.1826,
    "D": 293.6648,
    "Eb": 311.1270,
    "E": 329.6276,
    "F": 349.2282,
    "Gb": 369.9944,
    "G": 391.9954,
    "Ab": 415.3047,
    "A": 440.0000,
    "Bb": 466.1638,
    "B": 493.8833,
    "C2": 523.2511
}

// recording vals
let OCTAVE_VAL = 0;
let RECORDING_MODE = false;
let RECORDING_STARTED = false;
let RECORDING_BUFFER = [];
let NOTE_START_TIME = 0;
let NOTE_END_TIME = 0;
let SILENCE_START_TIME = 0;
let SILENCE_END_TIME = 0;
let synth = 0;

// initialize a synthesizer voice
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

// function to execute when a note is played
function playNote(key, synth, attack, release, distortion) {
    const noteName = key.dataset.note;
    key.classList.add('active');


    synth.attack = attack;
    synth.release = release;

    if (distortion > 0) {
        var dist = new Pizzicato.Effects.Distortion({
            gain: distortion
        });

        synth.addEffect(dist);
    }

    synth.play();
    let freq = parseFloat(note_pairs[noteName]);

    if (OCTAVE_VAL == 0) {
        synth.frequency = freq;
    } else {
        if (OCTAVE_VAL < 0) {
            synth.frequency = freq / Math.abs(parseInt(OCTAVE_VAL) - 1)
        } else {
            synth.frequency = freq * Math.abs(parseInt(OCTAVE_VAL) + 1)
        }
    }
    console.log(Math.abs(OCTAVE_VAL))
    console.log(synth.frequency)

    if (RECORDING_MODE) {
        if (RECORDING_STARTED) {
            SILENCE_END_TIME = performance.now();
            let silenceDuration = SILENCE_END_TIME - SILENCE_START_TIME;
            RECORDING_BUFFER.push({
                "freq": 0,
                "time": silenceDuration,
                'osc': "none"
            })
        }

        NOTE_START_TIME = performance.now();
        RECORDING_STARTED = true;

    }

}

// function to execute when a note is no longer pressed
function killNote(key, synth, wave) {
    key.classList.remove('active');
    synth.stop();

    if (RECORDING_MODE) {
        NOTE_END_TIME = performance.now();
        let noteDuration = NOTE_END_TIME - NOTE_START_TIME;
        RECORDING_BUFFER.push({
            "freq": synth.frequency,
            "time": noteDuration,
            'osc': wave
        })

        SILENCE_START_TIME = performance.now();
    }
    console.log(RECORDING_BUFFER)
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

// main
function main() {


    // define key bindings
    const WHITE_KEYS = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',']
    const BLACK_KEYS = ['s', 'd', 'g', 'h', 'j']

    // get keys
    // const keys = document.querySelectorAll('.key')
    const whiteKeys = document.querySelectorAll('.key.white')
    const blackKeys = document.querySelectorAll('.key.black')

    let wave = "sine";
    let attack = 1;
    let release = 1;
    let distortion = 0;

    synth = createSynthVoice(wave);
    document.getElementById('osctype').addEventListener('change', function () {
        wave = this.value;
        synth = createSynthVoice(wave);
    });

    let attackelement = document.getElementById('attack'),
        attackdiv = document.getElementById("attackamount");

    attackelement.onchange = function () {
        attackdiv.innerHTML = this.value;
        attack = this.value;
    }

    let releaseelement = document.getElementById('release'),
        releasediv = document.getElementById("releaseamount");

    releaseelement.onchange = function () {
        releasediv.innerHTML = this.value;
        release = this.value;
    }

    // play note when note is played
    document.addEventListener('keydown', e => {


        if (e.repeat) return
        const key = e.key
        const whiteKeyIndex = WHITE_KEYS.indexOf(key)
        const blackKeyIndex = BLACK_KEYS.indexOf(key)

        if (whiteKeyIndex > -1) {
            console.log(WHITE_KEYS.indexOf(key))
            console.log(whiteKeys[whiteKeyIndex])
            playNote(whiteKeys[whiteKeyIndex], synth, attack, release, distortion);
        }
        if (blackKeyIndex > -1) {
            playNote(blackKeys[blackKeyIndex], synth, attack, release, distortion);
        }
    })

    // kill note when note no longer playing
    document.addEventListener('keyup', e => {
        if (e.repeat) return
        const key = e.key
        const whiteKeyIndex = WHITE_KEYS.indexOf(key)
        const blackKeyIndex = BLACK_KEYS.indexOf(key)

        if (whiteKeyIndex > -1) {
            killNote(whiteKeys[whiteKeyIndex], synth, wave);
        }
        if (blackKeyIndex > -1) {
            killNote(blackKeys[blackKeyIndex], synth, wave);
        }
    })

    // update octave value when slider is changed
    let slide = document.getElementById('slide'),
        sliderDiv = document.getElementById("sliderAmount");

    slide.onchange = function () {
        sliderDiv.innerHTML = this.value;
        OCTAVE_VAL = this.value;
    }

    let record = document.getElementById("record");
    record.onclick = function () {
        if (record.classList.contains("true")) {
            record.classList.remove('true');
            RECORDING_MODE = false;
        } else {
            record.classList.add('true');
            RECORDING_MODE = true;
        }
    }


    let playback = document.getElementById("playback");
    playback.onclick = function () {
        for (let i = 0; i < RECORDING_BUFFER.length; i++) {
            const info = RECORDING_BUFFER[i];
            if (info['osc'] == "none") {
                sleep(info['time']);
            } else {
                const s = createSynthVoice(info['osc']);
                s.frequency = info['freq'];
                s.attack = attack;
                s.release = release;
                s.play();
                console.log(info['freq']);
                console.log(info['time']);

                sleep(info['time']);

                s.stop();
            }

        }
    }
}

window.onload = main;