function generateBarGraph(canvasId, arraySize, heatMapEnable = false) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) throw new Error(`Canvas with ID '${canvasId}' not found`);

    const ctx = canvas.getContext("2d");
    const array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);

    const chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: array.map((_, index) => index + 1),
            datasets: [
                {
                    label: "Array Values",
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
                    ticks: { stepSize: 10, callback: (value) => value },
                },
            },
        },
    });

    function getHeatmapColor(value, array) {
        const maxValue = Math.max(...array);
        const minValue = Math.min(...array);
        const range = maxValue - minValue || 1; 
        const normalized = (value - minValue) / range;
        const hue = 240 - 240 * normalized; // Blue (240) to Red (0)
        return `hsl(${hue}, 100%, 50%)`;
    }

    function updateChartData(newArray, activeIndexes = []) {
        chart.data.labels = newArray.map((_, index) => index + 1);
        chart.data.datasets[0].data = newArray;

        chart.data.datasets[0].backgroundColor = heatMapEnable
            ? newArray.map((value) => getHeatmapColor(value, newArray))
            : newArray.map((_, index) =>
                  activeIndexes.includes(index) ? "#FFA726" : "#42A5F5"
              );

        chart.update();
    }

    return { chart, updateChartData };
}

export { generateBarGraph };