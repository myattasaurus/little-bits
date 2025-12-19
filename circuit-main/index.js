import * as timer from '../src/timer.js';
import * as animation from '../src/animation.js';

let STARTED = 1;
let STOPPED = 2;

let audio = new AudioContext();
let oscillator;
let timerDiv;
let wakeLock;

document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
    let div = document.createElement('div');
    div.classList.add('column');
    div.id = 'dontainer';

    timerDiv = document.createElement('div');
    timer.init(timerDiv);
    timerDiv.id = 'timer';
    timerDiv.classList.add('huge-text');
    timerDiv.setAttribute('data-init-seconds', '2');
    timerDiv.setAttribute('data-ascending', 'false');
    div.appendChild(timerDiv);

    let button = document.createElement('button');
    button.addEventListener('click', onClickButton);
    button.innerText = 'Start';
    button.setAttribute('data-state', STOPPED);
    div.appendChild(button);

    document.body.appendChild(div);
}
async function onClickButton(e) {
    let button = e.target;
    let state = Number(button.getAttribute('data-state'))
    let text;

    if (state === STOPPED) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', e => wakeLock = null);
        } catch (error) {
            console.error(error);
        }
        state = STARTED;
        text = 'Stop';
        timer.start(timerDiv, audio.currentTime);
        animation.startAnimation(tick);
        if (audio.state === 'suspended') {
            await audio.resume();
        }
        setBuzzer();

    } else {
        if (wakeLock) {
            await wakeLock.release();
        }
        state = STOPPED;
        text = 'Start';
        oscillator.stop();
        animation.stopAnimation();
        timer.stop(timerDiv);
    }
    button.setAttribute('data-state', state);
    button.innerText = text;
}
function setBuzzer() {
    let gain = audio.createGain();

    oscillator = audio.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(518, audio.currentTime);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.addEventListener('ended', e => {
        oscillator.disconnect();
        gain.disconnect();
    });

    // Prime the oscillator, so that stupid javascript doesn't play the stupid actual sound late
    gain.gain.value = 0.00001;
    oscillator.start();

    // Play the stupid sound at the actual stupid time
    let buzzerStartTime; {
        let audioCurrentTime = audio.currentTime;
        let startupDelay; {
            let timerStartTs = Number(timerDiv.getAttribute('data-start-ts'));
            startupDelay = audioCurrentTime - timerStartTs;
        }
        let timerSeconds = Number(timerDiv.getAttribute('data-init-seconds'));
        buzzerStartTime = audioCurrentTime + timerSeconds - startupDelay;
    }
    gain.gain.setValueAtTime(0.25, buzzerStartTime);
    oscillator.stop(buzzerStartTime + 1);
}
function tick(interval) {
    timer.update(timerDiv, audio.currentTime);
}