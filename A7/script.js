"use strict";

// function to turn on theremin
function thereminOn(oscillator, oscillator2) {
    oscillator.play();
    oscillator2.play();

}

function thereminControl(e, oscillator, oscillator2, theremin, urlParams) {
    let x = e.offsetX;
    let y = e.offsetY;
    console.log("x:", x, "y:", y);

    // default frequencies
    let minFrequency = 220.0;
    let maxFrequency = 880.0;

    // check for frequency params and update accordingly
    if (urlParams.has('minfreq')) {
        minFrequency = parseFloat(urlParams.get('minfreq'));
    }

    if (urlParams.has('maxfreq')) {
        maxFrequency = parseFloat(urlParams.get('maxfreq'));
    }

    // create variables to update user with notes and frequencies
    let note1 = document.getElementById('note1');
    let freq1 = document.getElementById('frequency1')
    let note2 = document.getElementById('note2');
    let freq2 = document.getElementById('frequency2')
    let otoc1 = document.getElementById('otoc1')
    let otoc2 = document.getElementById('otoc2')

    // calculate new theremin frequency
    let freqRange = maxFrequency - minFrequency;
    let thereminFreq = minFrequency + ((x / theremin.clientWidth) * freqRange);
    let thereminVolume = 1.0 - (y / theremin.clientHeight);

    // set oscillator 1 frequency and information
    oscillator.frequency = thereminFreq;
    note1.innerHTML = "Oscillator 1 Note: " + noteFromFrequency(thereminFreq) + ' Hz \n';
    freq1.innerHTML = "Oscillator 1 Frequency: " + thereminFreq.toFixed(2) + ' Hz \n';
    otoc1.innerHTML = "Oscillator 1 Out of Tune By: " + midiFromFrequency(thereminFreq)[1] + " Hz \n"
    oscillator.volume = thereminVolume;


    // if oscillator 2 present, set frequency and information based on semitone interval
    if (urlParams.has('semitones')) {
        let semitoneDifference = urlParams.get('semitones');
        oscillator2.frequency = interval(thereminFreq, semitoneDifference);
        note2.innerHTML = "Oscillator 2 Note: " + noteFromFrequency(oscillator2.frequency) + '\n';
        freq2.innerHTML = "Oscillator 2 Frequency: " + (oscillator2.frequency).toFixed(2) + '\n';
        otoc2.innerHTML = "Oscillator 2 Out of Tune By: " + midiFromFrequency(thereminFreq)[1] + " Hz \n"
        oscillator2.volume = thereminVolume;

    } else {
        oscillator2.frequency = 0;
        oscillator2.volume = 0;
    }

    // log information
    console.log("Frequency (OSC1): ", thereminFreq);
    console.log("Frequency (OSC2): ", oscillator2.frequency);
    console.log("Volume (OSC1): ", thereminVolume);
    console.log("Volume (OSC2): ", oscillator2.volume)


}

// function to turn off theremin
function thereminOff(oscillator, oscillator2) {
    oscillator.stop();
    oscillator2.stop();
}

// function to load theremin
function runAfterLoadingPage() {

    // set default wave and check for params
    let oscillatorType = "sine";
    let urlParams = (new URL(document.location)).searchParams;

    // set oscillator type
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

    // event listeners
    const theremin = document.getElementById("thereminZone");

    // theremin.addEventListener("mouseenter", function () {
    //     thereminOn(oscillator, oscillator2);
    // });

    theremin.addEventListener("click", function (e) {
        thereminOn(oscillator, oscillator2);
        thereminControl(e, oscillator, oscillator2, theremin, urlParams);
    });

    theremin.addEventListener("mouseleave", function () {
        thereminOff(oscillator, oscillator2);
    });
}

window.onload = runAfterLoadingPage;