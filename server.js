const express = require('express');
const path = require('path');
const main = require('./code');  

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'charts.html'));
});


app.get('/get-stock-data', async (req, res) => {
    try {
        const capital = parseFloat(req.query.capital);
        if (isNaN(capital) || capital <= 0) {
            return res.status(400).json({ error: 'Invalid capital value. Please enter a valid number.' });
        }

        
        const stockData = await main(capital);
        res.json(stockData);  

    } catch (error) {
        console.error("Error fetching stock data:", error);
        res.status(500).json({ error: 'An error occurred while fetching stock data.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});