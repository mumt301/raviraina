"use strict";

let notenames = {
    0: "C",
    1: "C#",
    2: "D",
    3: "Eb",
    4: "E",
    5: "F",
    6: "F#",
    7: "G",
    8: "Ab",
    9: "A",
    10: "Bb",
    11: "B"
}

function interval(frequency, semitones) {
    // Assuming equal temperament
    return frequency * Math.pow(2, semitones / 12);
}

function midiToFrequency(midinumber, concertA = 440) {
    const A4 = 69
    if (midinumber === A4) {
        return concertA;
    }
    let semitones = midinumber - A4;
    return interval(440, semitones);
}

function midiFromFrequency(frequency) {
    let minDiff = Number.MAX_VALUE;
    let midinumber = -1;
    for (let midi = 0; midi < 128; midi++) {
        let midiFreq = midiToFrequency(midi);
        let freqDiff = Math.abs(midiFreq - frequency);
        if (freqDiff < minDiff) {
            minDiff = freqDiff;
            midinumber = midi;
        }
    }
    return [midinumber, minDiff]
}

function noteFromFrequency(frequency, withOctave = false) {
    const midinumber = midiFromFrequency(frequency)[0];
    const pitchclass = midinumber % 12;
    let octave = (midinumber - pitchclass) / 12;
    let notename = notenames[pitchclass];
    if (withOctave) {
        octave--;
        notename += octave;
    }
    return notename;
}