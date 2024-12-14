function createChart(chartContainer, array) {
    const ctx = chartContainer.getContext('2d'); 
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: array.map((_, index) => index + 1),
            datasets: [
                {
                    label: 'Array Values',
                    data: array,
                    backgroundColor: array.map(() => "#42A5F5"),
                },
            ],
        },
        options: {
            scales: {
                x: { display: false },
                y: {
                    beginAtZero: true,
                    ticks: { 
                        stepSize: 10, 
                        callback: (value) => value 
                    },
                },
            },
        },
    });
}

export { createChart };