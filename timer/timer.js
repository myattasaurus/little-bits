import * as timer from '../src/timer.js'

let button;

let STARTED = 1;
let STOPPED = 2;

document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {

    button = document.getElementById('button');
    button.addEventListener('click', onClickButton);
}
function onClickButton(e) {
    let state = Number(button.getAttribute('data-state'))
    let text;

    if (state === STOPPED) {
        state = STARTED;
        text = 'Stop';
        timer.start(document.getElementById('timer'));
    } else {
        state = STOPPED;
        text = 'Start';
        timer.stop();
    }
    button.setAttribute('data-state', state);
    button.innerText = text;
}