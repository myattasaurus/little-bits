let timer, button;

let STARTED = 1;
let STOPPED = 2;

function onLoad() {

    timer = document.getElementById('timer');

    button = document.getElementById('button');
    button.addEventListener('click', onClickButton);
}
function onClickButton(e) {
    let state = Number(button.getAttribute('data-state'))
    let text;

    if (state === STOPPED) {
        state = STARTED;
        text = 'Stop';
        animation.start(tick);
    } else {
        state = STOPPED;
        text = 'Start';
        animation.stop();
        timer.innerText = '00:00:00';
    }
    button.setAttribute('data-state', state);
    button.innerText = text;
}
let tick;{
    let bufferSeconds = 0; // makes testing easier
    tick = function (interval) {
        let secondsSinceStart = bufferSeconds + Math.floor((interval.currentTimestamp - interval.startingTimestamp) / 1000);
        let seconds = secondsSinceStart % 60;
        let minutes = Math.floor(secondsSinceStart / 60) % 60;
        let hours = Math.floor(secondsSinceStart / 60 / 60);
        timer.innerText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    function pad(digits) {
        digits = Math.abs(digits);
        if (digits === 0) return '00';
        if (digits < 10) return '0' + digits;
        return digits;
    }
}