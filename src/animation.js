let id;
let func;
let startFrame;

let interval = {};

export function startAnimation(callback) {
    startFrame = requestAnimationFrame;
    start(callback);
}
export function stopAnimation() {
    stop(cancelAnimationFrame);
}
export function startTimeout(callback) {
    startFrame = setTimeout;
    start(callback);
}
export function stopTimeout() {
    stop(clearTimeout);
}
function start(callback) {
    if (!id) {
        interval.startingTimestamp = Date.now();
        interval.previousTimestamp = interval.startingTimestamp;
        func = callback;
        id = startFrame(frame);
    }
}
function stop(stopFrame) {
    if (id) {
        stopFrame(id);
        id = null;
        interval = {};
    }
}
function frame() {
    interval.currentTimestamp = Date.now();
    interval.deltaMillis = interval.currentTimestamp - interval.currentTimestamp;
    interval.deltaSeconds = interval.deltaMillis / 1000;

    func(interval);

    interval.previousTimestamp = interval.currentTimestamp;

    id = startFrame(frame);
}