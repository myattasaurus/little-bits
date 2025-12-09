import * as animation from '../src/animation.js'

let element;

export function start(elem) {
    element = elem;
    animation.start(tick);
}
export function stop() {
    animation.stop();
    element.innerText = '0:00';
}

let bufferSeconds = 0; // makes testing easier
function tick(interval) {
    let secondsSinceStart = bufferSeconds + Math.floor((interval.currentTimestamp - interval.startingTimestamp) / 1000);
    let seconds = secondsSinceStart % 60;
    let minutes = Math.floor(secondsSinceStart / 60) % 60;
    let hours = Math.floor(secondsSinceStart / 60 / 60);

    if (hours > 0) {
        element.innerText = `${hours}:${pad(minutes)}:${pad(seconds)}`;
    } else if (minutes > 0) {
        element.innerText = `${minutes}:${pad(seconds)}`;
    } else {
        element.innerText = `0:${pad(seconds)}`;
    }
}
function pad(digits) {
    digits = Math.abs(digits);
    if (digits === 0) return '00';
    if (digits < 10) return '0' + digits;
    return digits;
}