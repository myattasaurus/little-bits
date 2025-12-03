/**
 * @type {AudioContext}
 */
let audio;
/**
 * @type {OscillatorNode}
 */
let oscillator;
let oscElements = {}

let volume;

function onLoad() {
    oscElements.wave = document.getElementById("wave");
    oscElements.freq = document.getElementById('freq');
    oscElements.frequency = document.getElementById('frequency');
    oscElements.freq.addEventListener('input', e => setFrequency(e.target.value));
    oscElements.frequency.addEventListener('input', e => setFrequency(e.target.value));

    document.getElementById('volume').addEventListener('input', e => setVolume(e.target.value));

    audio = new AudioContext();
    volume = audio.createGain();
    createOscillator();
}
function startOrStop() {
    let playButton = document.getElementById("playButton");
    if (playButton.innerText === 'Stop') {
        oscillator.stop();
        playButton.innerText = 'Play';
        createOscillator();
    } else {
        oscillator.start();
        playButton.innerText = 'Stop';
    }
}
function createOscillator() {
    oscillator = audio.createOscillator();
    oscillator.type = oscElements.wave.value;
    oscillator.frequency.setValueAtTime(oscElements.frequency.value, audio.currentTime);
    oscillator.connect(volume).connect(audio.destination);
}
function setFrequency(frequency) {
    oscElements.freq.value = frequency;
    oscElements.frequency.value = frequency;
    oscillator.frequency.setValueAtTime(frequency, audio.currentTime);
}
function setType(type) {
    oscElements.wave.value = type;
    oscillator.type = type;
}
function setVolume(val) {
    volume.gain.value = val;
}