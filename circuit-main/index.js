import * as timer from '../src/timer.js';
import * as animation from '../src/animation.js';

let STARTED = 1;
let STOPPED = 2;

let audio = new AudioContext();
let gain;
let oscillator;
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
    timerDiv.setAttribute('data-init-seconds', '5');
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
        timer.start(timerDiv);
        animation.startTimeout(tick);
        // Buzzer
        {
            if (audio.state === 'suspended') {
                let before = Date.now();
                audio.resume().then(() => {
                    let after = Date.now();
                    let startupDelayMillis = after - before;
                    oscillator.start();
                    setBuzzer(startupDelayMillis);
                })
            } else {
                setBuzzer();
            }
        }
    } else {
        if (wakeLock) {
            await wakeLock.release();
        }
        state = STOPPED;
        text = 'Start';
        gain.gain.cancelScheduledValues(0);
        animation.stopTimeout();
        timer.stop(timerDiv);
    }
    button.setAttribute('data-state', state);
    button.innerText = text;
}
function setBuzzer(startupDelayMillis = 0) {
    let buzzerStartTime = audio.currentTime + Number(timerDiv.getAttribute('data-init-seconds')) - startupDelayMillis / 1000;
    gain.gain.setValueAtTime(0.25, buzzerStartTime);
    gain.gain.setValueAtTime(0, buzzerStartTime + 1);
}
function tick(interval) {
    timer.update(timerDiv);
}