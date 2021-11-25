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
    let noteMode = 'any';
    if (urlParams.has('notemode')) {
        noteMode = urlParams.get('notemode');
    }

    if (noteMode == 'fixed') {
        console.log(midiFromFrequency(thereminFreq)[0])
        oscillator.frequency = midiToFrequency(midiFromFrequency(thereminFreq)[0])
        freq1.innerHTML = "Oscillator 1 Frequency: " + midiToFrequency(midiFromFrequency(oscillator.frequency)[0]).toFixed(2) + ' Hz \n';

    } else {
        oscillator.frequency = thereminFreq;
        freq1.innerHTML = "Oscillator 1 Frequency: " + oscillator.frequency.toFixed(2) + ' Hz \n';
        otoc1.innerHTML = "Oscillator 1 Out of Tune By: " + midiFromFrequency(oscillator.frequency)[1] + " Hz \n"
    }

    note1.innerHTML = "Oscillator 1 Note: " + noteFromFrequency(oscillator.frequency) + '\n';

    oscillator.volume = thereminVolume;

    let semitoneDifference = urlParams.get('semitones');
    semitoneDifference = -1;

    // if oscillator 2 present, set frequency and information based on semitone interval
    if (urlParams.has('semitones')) {

        if (semitoneDifference != -1) {
            oscillator2.frequency = interval(oscillator.frequency, semitoneDifference);

            if (noteMode == 'fixed') {
                console.log(midiFromFrequency(thereminFreq)[0])
                oscillator.frequency = midiToFrequency(midiFromFrequency(thereminFreq)[0])
                freq2.innerHTML = "Oscillator 2 Frequency: " + midiToFrequency(midiFromFrequency(oscillator2.frequency)[0]).toFixed(2) + ' Hz \n';

            } else {
                oscillator.frequency = thereminFreq;
                freq2.innerHTML = "Oscillator 2 Frequency: " + (oscillator2.frequency).toFixed(2) + ' Hz \n';
                otoc2.innerHTML = "Oscillator 2 Out of Tune By: " + midiFromFrequency(oscillator2.frequency)[1] + " Hz \n"
            }

            note2.innerHTML = "Oscillator 2 Note: " + noteFromFrequency(oscillator2.frequency) + '\n';

            oscillator2.volume = thereminVolume;
        } else {
            oscillator2.stop()
        }


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
    let playbackType = "slide";

    if (urlParams.has('playbacktype')) {
        playbackType = urlParams.get('playbacktype');
    }

    if (playbackType == "slide") {
        theremin.addEventListener("mouseenter", function () {
            thereminOn(oscillator, oscillator2);
        });

        theremin.addEventListener("mousemove", function (e) {
            thereminControl(e, oscillator, oscillator2, theremin, urlParams);
        });

        theremin.addEventListener("mouseleave", function () {
            thereminOff(oscillator, oscillator2);
        });
    } else {
        theremin.addEventListener("click", function (e) {
            thereminOn(oscillator, oscillator2);
            thereminControl(e, oscillator, oscillator2, theremin, urlParams);
        });

        theremin.addEventListener("mouseleave", function () {
            thereminOff(oscillator, oscillator2);
        });
    }

}

window.onload = runAfterLoadingPage;