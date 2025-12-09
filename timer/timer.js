import * as timer from '../src/timer.js'
import * as animation from '../src/animation.js'

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
        animation.start(interval => {
            timer.update(interval);
            timer.draw();
        })
    } else {
        state = STOPPED;
        text = 'Start';
        timer.stop();
        animation.stop();
    }
    button.setAttribute('data-state', state);
    button.innerText = text;
}