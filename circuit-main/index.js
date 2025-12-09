import * as timer from '../src/timer.js';
import * as animation from '../src/animation.js';

let STARTED = 1;
let STOPPED = 2;

let audio = new AudioContext();

document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
    let div = document.createElement('div');
    div.classList.add('column');
    div.id = 'dontainer';

    let timerDiv = document.createElement('div');
    timerDiv.id = 'timer';
    timerDiv.innerText = '0:00';
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
function onClickButton(e) {
    let button = e.target;
    let state = Number(button.getAttribute('data-state'))
    let text;

    if (state === STOPPED) {
        state = STARTED;
        text = 'Stop';
        timer.start(document.getElementById('timer'));
        animation.start(tick);
    } else {
        state = STOPPED;
        text = 'Start';
        timer.stop();
        animation.stop();
    }
    button.setAttribute('data-state', state);
    button.innerText = text;
}
function tick(interval) {
    timer.update(interval);
    timer.draw();
}