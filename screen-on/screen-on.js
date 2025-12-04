function onLoad() {

}
let wakeLock;
async function onClick() {
    let button = document.getElementById('button');
    if (button.innerText === 'Screen Stays On') {
        if (wakeLock) {
            await wakeLock.release();
        }
        button.innerText = 'Screen Can Go Off'
    } else {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', e => wakeLock = null);
        } catch (error) {
            console.error(error);
        }
        button.innerText = 'Screen Stays On';
    }
}