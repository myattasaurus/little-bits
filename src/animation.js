let animation = {};{
    let id;
    let func;

    let interval = {};

    animation.start = function(callback) {
        if (!id) {
            interval.startingTimestamp = performance.now();
            interval.previousTimestamp = interval.startingTimestamp;
            func = callback;
            id = requestAnimationFrame(frame);
        }
    }
    animation.stop = function() {
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
}