import * as timer from '../src/timer.js';
import * as animation from '../src/animation.js';

let STARTED = 1;
let STOPPED = 2;

let audio = new AudioContext();
let gain;
let oscillator;
let oscillatorStarted = false;
let timerDiv;
let wakeLock;

document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
    gain = audio.createGain();
    gain.gain.value = 0;

    oscillator = audio.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(518, audio.currentTime);
    oscillator.connect(gain).connect(audio.destination);

    let div = document.createElement('div');
    div.classList.add('column');
    div.id = 'dontainer';

    timerDiv = document.createElement('div');
    timer.init(timerDiv);
    timerDiv.id = 'timer';
    timerDiv.classList.add('huge-text');
    timerDiv.setAttribute('data-init-seconds', '60');
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
    if (!oscillatorStarted) {
        oscillator.start();
        oscillatorStarted = true;
    }
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
        timer.start(timerDiv);
        animation.startTimeout(tick);
    } else {
        if (wakeLock) {
            await wakeLock.release();
        }
        state = STOPPED;
        text = 'Start';
        animation.stopTimeout();
        timer.stop(timerDiv);
    }
    button.setAttribute('data-state', state);
    button.innerText = text;
}
function tick(interval) {
    timer.update(timerDiv);
    gain.gain.value = timerDiv.getAttribute('data-seconds') === '0' ? 0.25 : 0;
}