function onLoad() {
    let div = document.createElement('div');
    div.classList.add('row');
    div.id = 'dontainer';

    let col = document.createElement('div');
    col.classList.add('column');
    col.appendChild(square('Rounds', 10, 1, 1, displayNumber));
    col.appendChild(square('Sets', 4, 1, 1, displayNumber));
    div.appendChild(col);

    col = document.createElement('div');
    col.classList.add('column');
    col.appendChild(square('Break Time', 30, 15, 15, displayTime));
    col.appendChild(square('Set Time', 60, 15, 15, displayTime));
    div.appendChild(col);

    document.body.appendChild(div);
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
