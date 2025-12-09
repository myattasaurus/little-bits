let element, seconds, minutes, hours, totalSeconds;

export function start(elem = element) {
    element = elem;
    if (element.getAttribute('data-ascending') === undefined || element.getAttribute('data-ascending') === null) {
        element.setAttribute('data-ascending', 'true');
    }
    if (element.getAttribute('data-init-seconds') === undefined || element.getAttribute('data-init-seconds') === null) {
        element.setAttribute('data-init-seconds', '0');
    }
}
export function stop() {
    element.innerText = '0:00';
}
export function update(interval) {
    let bufferSeconds = Number(element.getAttribute('data-init-seconds'));
    let ascending = element.getAttribute('data-ascending') === 'true' ? 1 : -1;
    let secondsSinceStart = ascending * (interval.currentTimestamp - interval.startingTimestamp);
    totalSeconds = bufferSeconds + ascending * Math.floor(ascending * secondsSinceStart / 1000);

    seconds = totalSeconds % 60;
    minutes = Math.floor(totalSeconds / 60) % 60;
    hours = Math.floor(totalSeconds / 60 / 60);
}
export function draw() {
    if (hours > 0) {
        element.innerText = `${hours}:${pad(minutes)}:${pad(seconds)}`;
    } else if (minutes > 0) {
        element.innerText = `${minutes}:${pad(seconds)}`;
    } else {
        element.innerText = `0:${pad(seconds)}`;
    }
    if (totalSeconds < 0) {
        element.innerText = `-${element.innerText}`;
    }
}
function pad(digits) {
    digits = Math.abs(digits);
    if (digits === 0) return '00';
    if (digits < 10) return '0' + digits;
    return digits;
}