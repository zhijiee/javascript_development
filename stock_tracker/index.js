// import { apiKey } from './config.js';
// const store = require('./config');

import { apiKey } from "./config.js";

// const apiKey = config.apiKey;
const symbolInput = document.querySelector('#symbol');
const stockList = document.querySelector('#stock-list');

// Function to fetch and display the top 10 stocks
function fetchTopStocks() {
    // Fetch data from api
    fetch(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`).then(response => response.json()).then(data => {
        const stocks = data['top_gainers'];
        let html = '';
        // Loop through the stocks and generate html for each stock
        for (let i = 0; i < 10; i++) {
            const symbol = stocks[i]['ticker'];
            const change = stocks[i]['change_amount'];
            const changeColor = parseFloat(change) >= 0 ? 'green' : 'red';
            html += `
            <li>
                <span class="symbol">${symbol}</span>
                <span class="change" style="color: ${changeColor}">${change}</span>
            </li>    
            `;
        }

        // Update stock list container
        stockList.innerHTML = html;
    }).catch(error => console.error(error));
}

// Function to fetch and display stock data for the searched symbol
function fetchStockData(symbol) {
    // If input was empty display top 10 stocks
    if (!symbol) {
        fetchTopStocks();
        return;
    }

    // Fetch the stock data for the provided symbol from api
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}}`).then(response => response.json()).then(data => {
        const quote = data['Global Quote'];
        if (quote && quote['10. change percent']) {
            const changePercent = quote['10. change percent'].replace('%', '');
            const changeColor = parseFloat(changePercent) >= 0 ? 'green' : 'red';
            const html = `<li>
            <span class="symbol">${symbol}</span>
            <span class="change" style="color: ${changeColor}">${changePercent}</span>
        </li>    
        `;
            stockList.innerHTML = html;
        } else {
            stockList.innerHTML = '<li class="error">Invalid Symbol</li>';
        }
    }).catch(error => console.error(error));

}

// Display top 10 on page load
fetchTopStocks();
console.log(apiKey)
// Handle from submission
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Get symbol entered by user and convert it to uppercase
    const symbol = symbolInput.value.toUpperCase();
    fetchStockData(symbol);
});