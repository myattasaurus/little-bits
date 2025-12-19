export function init(element) {
    element.innerText = '0:00';
}
export function now() {
    return performance.now();
}
export function start(element, currentTimestamp) {
    if (element.getAttribute('data-ascending') === undefined || element.getAttribute('data-ascending') === null) {
        element.setAttribute('data-ascending', 'true');
    }
    if (element.getAttribute('data-init-seconds') === undefined || element.getAttribute('data-init-seconds') === null) {
        element.setAttribute('data-init-seconds', '0');
    }
    element.setAttribute('data-start-ts', currentTimestamp);
}
export function stop(element) {
    init(element);
    element.removeAttribute('data-seconds');
    element.removeAttribute('data-start-ts');
}
export function update(element, currentTimestamp) {
    let bufferSeconds = Number(element.getAttribute('data-init-seconds'));
    let ascending = element.getAttribute('data-ascending') === 'true' ? 1 : -1;
    let startingTimestamp = Number(element.getAttribute('data-start-ts'));
    let secondsSinceStart = ascending * (currentTimestamp - startingTimestamp);
    let totalSeconds = bufferSeconds + ascending * Math.floor(ascending * secondsSinceStart);
    let previousSeconds = Number(element.getAttribute('data-seconds'));

    if (previousSeconds !== totalSeconds) {
        element.setAttribute('data-seconds', totalSeconds);
        draw(element, totalSeconds);
    }
}
function draw(element, totalSeconds) {
    let seconds = totalSeconds % 60;
    let minutes = Math.floor(totalSeconds / 60) % 60;
    let hours = Math.floor(totalSeconds / 60 / 60);

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