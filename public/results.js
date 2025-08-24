document.addEventListener('DOMContentLoaded', () => {
    // Retrieve stock data from localStorage
    const stockData = JSON.parse(localStorage.getItem('stockData'));

    // Check if data exists
    if (!stockData) {
        console.error('No stock data found in localStorage.');
        document.body.innerHTML = '<h2>No data available to display.</h2>';
        return;
    }

    console.log('Retrieved stock data:', stockData); // Debug: Log the stock data to ensure it's correctly retrieved

    // Display maximum profit
    const maxProfitContainer = document.getElementById('max-profit');
    const profitAmount = document.getElementById('profit-amount');
    if (maxProfitContainer && profitAmount) {
        maxProfitContainer.style.display = 'block'; // Ensure the container is visible
        if (stockData.MaximumProfit) {
            profitAmount.innerText = stockData.MaximumProfit.toFixed(2); // Display the profit value
        } else {
            console.error('MaximumProfit field is missing in stock data.');
            profitAmount.innerText = '0'; // Fallback if MaximumProfit is missing
        }
    }

    // Prepare data for charts
    const stockNames = stockData.StocksToBuy.map(stock => stock.name);
    const stockProfits = stockData.StocksToBuy.map(stock => stock.profit * stock.quantity);
    const stockQuantities = stockData.StocksToBuy.map(stock => stock.quantity);

    // Dummy data for the line chart
    const performanceDates = ['2019', '2020', '2021', '2022', '2023'];
    const performanceProfits = [5000, 7000, 12000, 15000, 20000];

    // Render Bar Chart
    const ctxBar = document.getElementById('stockBarChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: stockNames,
            datasets: [{
                label: 'Profit (₹)',
                data: stockProfits,
                backgroundColor: ['#4caf50', '#ff5722', '#2196f3'],
                borderColor: ['#388e3c', '#e64a19', '#1976d2'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

   // Render Pie Chart
const ctxPie = document.getElementById('stockPieChart').getContext('2d');
const colors = generateUniqueColors(stockNames.length); // Generate unique colors based on stock count

new Chart(ctxPie, {
    type: 'pie',
    data: {
        labels: stockNames,
        datasets: [{
            data: stockQuantities,
            backgroundColor: colors, // Use unique colors
        }]
    },
    options: {
        responsive: true,
    }
});

// Function to generate unique colors
function generateUniqueColors(count) {
    const colors = [];
    const saturation = 70; // Saturation level
    const lightness = 50; // Lightness level

    for (let i = 0; i < count; i++) {
        // Evenly space hues around the color wheel
        const hue = Math.floor((360 / count) * i); // Divide 360 degrees by the number of stocks
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return colors;
}
    // Render Line Chart
    const ctxLine = document.getElementById('stockLineChart').getContext('2d');
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: performanceDates,
            datasets: [{
                label: 'Monthly Profit (₹)',
                data: performanceProfits,
                borderColor: '#ff9800',
                backgroundColor: 'rgba(255, 152, 0, 0.2)',
                fill: true,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Profit (₹)'
                    }
                }
            }
        }
    });
});
