let id;
let func;

let interval = {};

export function start(callback) {
    if (!id) {
        interval.startingTimestamp = performance.now();
        interval.previousTimestamp = interval.startingTimestamp;
        func = callback;
        id = requestAnimationFrame(frame);
    }
}
export function stop() {
    if (id) {
        cancelAnimationFrame(id);
        id = null;
        interval = {};
    }
}
function frame() {
    interval.currentTimestamp = performance.now();
    interval.deltaMillis = interval.currentTimestamp - interval.currentTimestamp;
    interval.deltaSeconds = interval.deltaMillis / 1000;

    func(interval);

    interval.previousTimestamp = interval.currentTimestamp;

    id = requestAnimationFrame(frame);
}