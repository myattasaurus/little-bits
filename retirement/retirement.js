function onLoad() {
    document.getElementById('expenses').addEventListener('change', calculatePrinciple);
    document.getElementById('apy').addEventListener('change', calculatePrinciple);
    document.getElementById('inflation').addEventListener('change', calculatePrinciple);
    calculatePrinciple();
}

function calculatePrinciple() {
    let monthlyExpenses = getNumber('expenses');
    let apy = getNumber('apy');
    let inflation = getNumber('inflation');
    let actualApy = (apy - inflation) / 100;
    let yearlyExpenses = 12 * monthlyExpenses;

    document.getElementById('principle').innerHTML = format(yearlyExpenses / actualApy);
}

function getNumber(elementName) {
    return Number(document.getElementById(elementName).value);
}

function format(num) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(num);
}