"use strict";

function thereminOn(oscillator, oscillator2) {
    oscillator.play();
    oscillator2.play();

}

function thereminControl(e, oscillator, oscillator2, theremin, urlParams) {
    let x = e.offsetX;
    let y = e.offsetY;
    console.log(x, y);

    let minFrequency = 220.0;
    let maxFrequency = 880.0;

    // if (urlParams.has('minfreq')) {
    //     minFrequency = urlParams.get('minfreq');
    //     console.log(minFrequency)
    // }

    // if (urlParams.has('maxfreq')) {
    //     maxFrequency = urlParams.get('maxfreq');
    //     console.log(maxFrequency)
    // }

    let note1 = document.getElementById('note1');
    let freq1 = document.getElementById('frequency1')
    let note2 = document.getElementById('note2');
    let freq2 = document.getElementById('frequency2')
    let freqRange = maxFrequency - minFrequency;
    let thereminFreq = minFrequency + ((x / theremin.clientWidth) * freqRange);
    let thereminVolume = 1.0 - (y / theremin.clientHeight);

    oscillator.frequency = thereminFreq;
    note1.innerHTML = noteFromFrequency(thereminFreq);
    freq1.innerHTML = thereminFreq;
    console.log("Frequency (OSC1): ", thereminFreq);


    if (urlParams.has('semitones')) {
        let semitoneDifference = urlParams.get('semitones');
        oscillator2.frequency = interval(thereminFreq, semitoneDifference);
        note2.innerHTML = noteFromFrequency(oscillator2.frequency);
        freq2.innerHTML = oscillator2.frequency;
    } else {
        oscillator2.frequency = 0;
    }
    console.log("Frequency (OSC2): ", oscillator2.frequency);


    console.log("Volume: ", thereminVolume);
    oscillator.volume = thereminVolume;
    oscillator2.volume = thereminVolume;

}

function thereminOff(oscillator, oscillator2) {
    oscillator.stop();
    oscillator2.stop();
}

function runAfterLoadingPage() {

    let oscillatorType = "sine";
    let urlParams = (new URL(document.location)).searchParams;

    if (urlParams.has('osctype')) {
        oscillatorType = urlParams.get('osctype')
    }

    const oscillator = new Pizzicato.Sound({
        source: 'wave',
        options: {
            type: oscillatorType,
            frequency: 220
        }
    });

    const oscillator2 = new Pizzicato.Sound({
        source: 'wave',
        options: {
            type: oscillatorType,
            frequency: 220
        }
    });

    const theremin = document.getElementById("thereminZone");

    theremin.addEventListener("mouseenter", function (e) {
        thereminOn(oscillator, oscillator2);
    });

    theremin.addEventListener("mousemove", function (e) {
        thereminControl(e, oscillator, oscillator2, theremin, urlParams);
    });

    theremin.addEventListener("mouseleave", function () {
        thereminOff(oscillator, oscillator2);
    });
}

window.onload = runAfterLoadingPage;