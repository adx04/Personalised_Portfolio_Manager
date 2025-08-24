

const { MongoClient } = require('mongodb');


async function fetchStockData(client) {
    const database = client.db('nifty50_database');
    const collection = database.collection('nifty50');
    const stocks = await collection.find({}).toArray();
    const weights = stocks.map(stock => stock.Open_2019);
    const profits = stocks.map(stock => stock.Profit_Loss_Open_2019);
    const stockNames = stocks.map(stock => stock['Stock Name']);
    return { weights, profits, stockNames };
}


function unboundedKnapsackWithSolution(weights, profits, capital) {
    let dp = Array(capital + 1).fill(0);
    let itemTracker = Array(capital + 1).fill(null);

    for (let i = 0; i <= capital; i++) {
        for (let j = 0; j < weights.length; j++) {
            if (weights[j] <= i && dp[i] < dp[i - weights[j]] + profits[j]) {
                dp[i] = dp[i - weights[j]] + profits[j];
                itemTracker[i] = j;
            }
        }
    }

    const selectedStocks = findSelectedStocks(weights, capital, itemTracker);
    return {
        maximumProfit: dp[capital],
        stocksToBuy: selectedStocks
    };
}


function findSelectedStocks(weights, capital, itemTracker) {
    const selectedStocksIndices = [];
    let remainingCapacity = capital;

    while (remainingCapacity > 0 && itemTracker[remainingCapacity] !== null) {
        let itemIndex = itemTracker[remainingCapacity];
        selectedStocksIndices.push(itemIndex);
        remainingCapacity -= weights[itemIndex];
    }

    return selectedStocksIndices;
}

async function main(capital) {
    const uri = "mongodb+srv://shlok:vTpCyET7EeiVg3zi@project.mitpv.mongodb.net/";
    const client = new MongoClient(uri);
    await client.connect();
    const { weights, profits, stockNames } = await fetchStockData(client);

    const solution = unboundedKnapsackWithSolution(weights, profits, capital);

    const stocksToBuy = solution.stocksToBuy.map(index => stockNames[index]);
    const stockQuantity = {};
    stocksToBuy.forEach(stock => {
        if (!stockQuantity[stock]) {
            stockQuantity[stock] = 0;
        }
        stockQuantity[stock]++;
    });

    const finalOutput = {
        MaximumProfit: solution.maximumProfit,
        StocksToBuy: Object.keys(stockQuantity).map(stock => ({
            name: stock,
            price: weights[stockNames.indexOf(stock)],
            profit: profits[stockNames.indexOf(stock)],
            quantity: stockQuantity[stock]
        }))
    };

    await client.close();
    return finalOutput;  
}

module.exports = main;  
