import * as timer from "../src/timer.js";
import * as animation from "../src/animation.js";

let page = {
    main: {},
    timer: {}
};
document.addEventListener('DOMContentLoaded', function() {
    page.main.load();
    document.body.appendChild(page.main.element);
    page.timer.load();
});
// main page
{
    let main = page.main;
    main.load = () => {
        main.element = document.createElement('div');
        main.element.classList.add('column');

        let div = document.createElement('div');
        div.classList.add('row');
        div.id = 'dontainer';

        let col = document.createElement('div');
        col.classList.add('column');
        col.appendChild(square('Rounds', 8, 1, 1, displayNumber));
        col.appendChild(square('Sets', 4, 1, 1, displayNumber));
        div.appendChild(col);

        col = document.createElement('div');
        col.classList.add('column');
        col.appendChild(square('Break Time', 45, 15, 15, displayTime));
        col.appendChild(square('Set Time', 60, 15, 15, displayTime));
        div.appendChild(col);

        main.element.appendChild(div);

        let button = document.createElement('button');
        button.innerText = 'Go';
        button.addEventListener('click', e => {
            document.body.removeChild(document.body.firstElementChild);
            document.body.appendChild(page.timer.element);
        });
        main.element.appendChild(button);
    }
    function square(title, amount, step, min, display) {
        let square = document.createElement('div');
        square.classList.add('column');

        let h1 = document.createElement('h1');
        h1.innerText = title;

        let shifter = document.createElement('div');
        shifter.classList.add('shifter');

        let amt = document.createElement('div');
        amt.classList.add('huge-text');
        amt.setAttribute('data-value', amount);
        amt.setAttribute('data-step', step);
        amt.setAttribute('data-min', min);
        display(amt);

        let more = document.createElement('div');
        more.innerText = 'More';
        more.classList.add('normal-text');
        more.addEventListener('click', e => {
            let amount = Number(amt.getAttribute('data-value'));
            amt.setAttribute('data-value', String(amount + step));
            display(amt);
        });

        let less = document.createElement('div');
        less.innerText = 'Less';
        less.classList.add('normal-text');
        less.addEventListener('click', e => {
            let amount = Number(amt.getAttribute('data-value'));
            amount -= step;
            if (amount < min) {
                amount = min;
            }
            amt.setAttribute('data-value', String(amount));
            display(amt);
        });

        square.appendChild(h1);
        square.appendChild(shifter);
        shifter.appendChild(more);
        shifter.appendChild(amt);
        shifter.appendChild(less);

        return square;
    }
    function displayNumber(element) {
        element.innerText = element.getAttribute('data-value');
    }
    function displayTime(element) {
        let totalSeconds = Number(element.getAttribute('data-value'));
        let seconds = totalSeconds % 60;
        let minutes = Math.floor(totalSeconds / 60);
        element.innerText = `${minutes}:${pad(seconds)}`;
    }
    function pad(seconds) {
        return seconds < 10 ? '0' + seconds : seconds;
    }
}
// timer page
{
    let STARTED = 1;
    let STOPPED = 2;

    let audio = new AudioContext();
    let oscillator;
    let timerDiv;
    let wakeLock;

    page.timer.load = () => {
        let div = document.createElement('div');
        div.classList.add('column');
        div.id = 'dontainer';

        timerDiv = document.createElement('div');
        timer.init(timerDiv);
        timerDiv.id = 'timer';
        timerDiv.classList.add('huge-text');
        timerDiv.setAttribute('data-init-seconds', '2');
        timerDiv.setAttribute('data-ascending', 'false');
        div.appendChild(timerDiv);

        let button = document.createElement('button');
        button.addEventListener('click', onClickButton);
        button.innerText = 'Start';
        button.setAttribute('data-state', STOPPED);
        div.appendChild(button);

        page.timer.element = div;
    }
    async function onClickButton(e) {
        let button = e.target;
        let state = Number(button.getAttribute('data-state'))
        let text;

        if (state === STOPPED) {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
                wakeLock.addEventListener('release', e => wakeLock = null);
            } catch (error) {
                console.error(error);
            }
            state = STARTED;
            text = 'Stop';
            timer.start(timerDiv);
            animation.startAnimation(tick);
            if (audio.state === 'suspended') {
                audio.resume().then(setBuzzer);
            } else {
                setBuzzer();
            }
        } else {
            if (wakeLock) {
                await wakeLock.release();
            }
            state = STOPPED;
            text = 'Start';
            oscillator.stop();
            animation.stopAnimation();
            timer.stop(timerDiv);
        }
        button.setAttribute('data-state', state);
        button.innerText = text;
    }
    function setBuzzer() {
        let gain = audio.createGain();

        oscillator = audio.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(518, audio.currentTime);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.addEventListener('ended', e => {
            oscillator.disconnect();
            gain.disconnect();
        });

        // Prime the oscillator, so that stupid javascript doesn't play the stupid actual sound late
        gain.gain.value = 0.00001;
        oscillator.start();

        // Play the stupid sound at the actual stupid time
        let buzzerStartTime; {
            let duration; {
                let timerCurrentTs = timer.now();
                let timerStartTs = Number(timerDiv.getAttribute('data-start-ts'));
                let timerDuration = Number(timerDiv.getAttribute('data-init-seconds')) * 1000;
                let timerEndTs = timerDuration + timerStartTs;
                duration = timerEndTs - timerCurrentTs;
            }
            let audioCurrentTs = audio.currentTime * 1000;
            buzzerStartTime = (audioCurrentTs + duration) / 1000;
        }
        gain.gain.setValueAtTime(0.25, buzzerStartTime);
        oscillator.stop(buzzerStartTime + 1);
    }
    function tick(interval) {
        timer.update(timerDiv);
    }
}