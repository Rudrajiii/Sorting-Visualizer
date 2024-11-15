document.addEventListener('DOMContentLoaded', () => {
    const increaseSpeedBtn = document.getElementById('increaseSpeed');
    const decreaseSpeedBtn = document.getElementById('decreaseSpeed');
    const increaseSizeBtn = document.getElementById('increaseSize');
    const decreaseSizeBtn = document.getElementById('decreaseSize');
    const algorithmSelect = document.getElementById('algorithmSelect');
    const resetBtn = document.getElementById('reset');
    const shuffleBtn = document.getElementById('shuffle');
    const chartContainer = document.getElementById('chart');
    const arraySizeLabel = document.getElementById('arraySizeLabel');
    const createArrayBtn = document.getElementById('createArray');
    const runBtn = document.getElementById('Run');
    const heatMapBtn = document.getElementById('heatMap');
    const speedLabel = document.getElementById('speedLabel');
    const algoLabel = document.getElementById('algoLabel');
    const compare = document.getElementById('compare');

    let speed = 1;
    let size = 50;
    let array = generateArray(size);
    let isRunning = false;
    let isHeatMapEnabled = false; // Heatmap toggle state

    const ctx = chartContainer.getContext('2d');
    let chart = new Chart(ctx, {
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
                    ticks: { stepSize: 10, callback: (value) => value },
                },
            },
        },
    });

    function generateArray(size) {
        return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    }

    function updateChartData(newArray, activeIndexes = []) {
        chart.data.labels = newArray.map((_, index) => index + 1);
        chart.data.datasets[0].data = newArray;

        if (isHeatMapEnabled) {
            chart.data.datasets[0].backgroundColor = newArray.map((value) =>
                getHeatmapColor(value, newArray)
            );
        } else {
            chart.data.datasets[0].backgroundColor = newArray.map((_, index) =>
                activeIndexes.includes(index) ? '#FFA726' : '#42A5F5' // Orange for active, blue for default
            );
        }

        chart.update();
    }

    function getHeatmapColor(value, array) {
        const maxValue = Math.max(...array);
        const minValue = Math.min(...array);
        const range = maxValue - minValue || 1; // Avoid division by zero
        const normalized = (value - minValue) / range;
        const hue = 240 - (240 * normalized); // Blue (240) to Red (0)
        return `hsl(${hue}, 100%, 50%)`;
    }

    createArrayBtn.addEventListener('click', () => {
        array = generateArray(size);
        updateChartData(array);
    });

    heatMapBtn.addEventListener('click', () => {
        isHeatMapEnabled = !isHeatMapEnabled;
        heatMapBtn.textContent = isHeatMapEnabled ? 'Hide Heat-Map 📊' : 'Show Heat-Map 📊';
        updateChartData(array);
    });

    increaseSpeedBtn.addEventListener('click', () => {
        speed = Math.min(speed + 1, 10);
        speedLabel.textContent = `Speed: ${speed}`;
    });

    decreaseSpeedBtn.addEventListener('click', () => {
        speed = Math.max(speed - 1, 1);
        speedLabel.textContent = `Speed: ${speed}`;
    });

    increaseSizeBtn.addEventListener('click', () => {
        size = Math.min(size + 5, 100);
        array = generateArray(size);
        updateChartData(array);
        arraySizeLabel.textContent = `Array Size: ${size}`;
    });

    decreaseSizeBtn.addEventListener('click', () => {
        size = Math.max(size - 5, 5);
        array = generateArray(size);
        updateChartData(array);
        arraySizeLabel.textContent = `Array Size: ${size}`;
    });

    resetBtn.addEventListener('click', () => {
        array = generateArray(size);
        updateChartData(array);
    });

    shuffleBtn.addEventListener('click', () => {
        array = shuffleArray(array);
        updateChartData(array);
    });

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    runBtn.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;

        const selectedAlgorithm = algorithmSelect.value;
        switch (selectedAlgorithm) {
            case 'bubbleSort':
                bubbleSort(array);
                break;
            case 'selectionSort':
                selectionSort(array);
                algoLabel.textContent = "Running: Selection Sort";
                break;
            case 'insertionSort':
                insertionSort(array);
                algoLabel.textContent = "Running: Insertion Sort"
                break;
            case 'quickSort':
                quickSort(array, 0, array.length - 1);
                algoLabel.textContent = "Running: Quick Sort"
                break;
            case 'mergeSort':
                mergeSort(array, 0, array.length - 1);
                algoLabel.textContent = "Running: Merge Sort"
                break;
            default:
                isRunning = false;
                break;
        }
    });

    function bubbleSort(array) {
        let n = array.length;
        let i = 0, j = 0;

        let interval = setInterval(() => {
            if (i < n - 1) {
                if (j < n - i - 1) {
                    if (array[j] > array[j + 1]) {
                        [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    }
                    updateChartData(array, [j, j + 1]);
                    j++;
                } else {
                    j = 0;
                    i++;
                }
            } else {
                clearInterval(interval);
                setAllColor('#66BB6A');
                isRunning = false;
            }
        }, 1000 / speed);
    }

    function selectionSort(array) {
        let n = array.length;
        let i = 0, j = i + 1, minIndex = 0;

        let interval = setInterval(() => {
            if (i < n - 1) {
                if (j < n) {
                    if (array[j] < array[minIndex]) {
                        minIndex = j;
                    }
                    updateChartData(array, [j, minIndex]);
                    j++;
                } else {
                    if (minIndex !== i) {
                        [array[i], array[minIndex]] = [array[minIndex], array[i]];
                    }
                    setColor(i, '#66BB6A');
                    i++;
                    j = i + 1;
                    minIndex = i;
                }
            } else {
                clearInterval(interval);
                setAllColor('#66BB6A');
                isRunning = false;
            }
        }, 1000 / speed);
    }

    function insertionSort(array) {
        let n = array.length;
        let i = 1, j = 0;

        let interval = setInterval(() => {
            if (i < n) {
                let key = array[i];
                j = i - 1;
                while (j >= 0 && array[j] > key) {
                    array[j + 1] = array[j];
                    j--;
                }
                array[j + 1] = key;
                updateChartData(array, [i, j + 1]);
                setColor(i, '#66BB6A');
                i++;
            } else {
                clearInterval(interval);
                setAllColor('#66BB6A');
                isRunning = false;
            }
        }, 1000 / speed);
    }
    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    
    async function quickSort(array, left, right) {
        if (left < right) {
            let pivotIndex = await partition(array, left, right); // Wait for the partition to complete
            updateChartData(array, [pivotIndex]); // Highlight the pivot element
            await quickSort(array, left, pivotIndex - 1); // Wait for the left part to be sorted
            await quickSort(array, pivotIndex + 1, right); // Wait for the right part to be sorted
        }
    
        if (left === 0 && right === array.length - 1) {
            setAllColor('#66BB6A'); // Mark the entire array as sorted
            isRunning = false;
        }
    }
    
    async function partition(array, left, right) {
        let pivot = array[right];
        let i = left - 1;
    
        for (let j = left; j < right; j++) {
            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                updateChartData(array, [i, j]); // Highlight swapping elements
                await delay(1000 / speed); // Add delay for visualization
            }
        }
        [array[i + 1], array[right]] = [array[right], array[i + 1]];
        updateChartData(array, [i + 1, right]); // Highlight final position of the pivot
        await delay(1000 / speed); // Add delay for visualization
        return i + 1;
    }
    

    async function mergeSort(array, left, right) {
        if (left < right) {
            let mid = Math.floor((left + right) / 2);
    
            await mergeSort(array, left, mid); // Wait for the left half to be sorted
            await mergeSort(array, mid + 1, right); // Wait for the right half to be sorted
            await merge(array, left, mid, right); // Merge both halves
        }
    
        if (left === 0 && right === array.length - 1) {
            setAllColor('#66BB6A'); // Mark the entire array as sorted
            isRunning = false;
        }
    }
    
    async function merge(array, left, mid, right) {
        let leftArr = array.slice(left, mid + 1);
        let rightArr = array.slice(mid + 1, right + 1);
        let i = 0, j = 0, k = left;
    
        while (i < leftArr.length && j < rightArr.length) {
            if (leftArr[i] <= rightArr[j]) {
                array[k++] = leftArr[i++];
            } else {
                array[k++] = rightArr[j++];
            }
            updateChartData(array, [k - 1]); // Highlight the current index
            await delay(1000 / speed); // Add delay for visualization
        }
    
        while (i < leftArr.length) {
            array[k++] = leftArr[i++];
            updateChartData(array, [k - 1]);
            await delay(1000 / speed);
        }
    
        while (j < rightArr.length) {
            array[k++] = rightArr[j++];
            updateChartData(array, [k - 1]);
            await delay(1000 / speed);
        }
    }
    
    function setColor(index, color) {
        chart.data.datasets[0].backgroundColor[index] = color;
        chart.update();
    }

    function setAllColor(color) {
        chart.data.datasets[0].backgroundColor = Array(array.length).fill(color);
        chart.update();
    }
    compare.addEventListener('click', () => {
        alert("Will Implement Later 🥲");
    })
});
