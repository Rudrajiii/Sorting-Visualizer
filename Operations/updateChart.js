function updateChart_Data(chart, newArray, activeIndexes = [], isHeatMapEnable = false) {
    chart.data.labels = newArray.map((_, index) => index + 1);
    chart.data.datasets[0].data = newArray;
    isHeatMapEnable = JSON.parse(localStorage.getItem("isHeatMapEnable")) || false;

    chart.data.datasets[0].backgroundColor = isHeatMapEnable
        ? newArray.map((value) => getHeatmapColor(value, newArray))
        : newArray.map((_, index) =>
              activeIndexes.includes(index) ? "#FFA726" : "#42A5F5"
          );

    chart.update();
}

function getHeatmapColor(value, array) {
    const maxValue = Math.max(...array);
    const minValue = Math.min(...array);
    const range = maxValue - minValue || 1;
    const normalized = (value - minValue) / range;
    const hue = 240 - 240 * normalized;
    return `hsl(${hue}, 100%, 50%)`;
}

export { updateChart_Data };
