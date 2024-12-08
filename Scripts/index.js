import { generateBarGraph } from '../Operations/generatedCanvasFunc.js';
import { updateChart_Data } from '../Operations/updateChart.js';
import { showCardPopup } from '../Components/popupCard.js';
import { createChart } from '../canvas/main_canvas.js';
import { _bubbleSort , _insertionSort , _mergeSort , _quickSort , _selectionSort } from '../Algorithms/algo.js';
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
    const compare_run = document.getElementById('compareKr');

    let speed = 5;
    let size = 50;
    let set_speed = 5;
    let array = generateArray(size);
    let isRunning = false;
    let isRunning_in_Comparision_mode = false;
    let isHeatMapEnabled = false;
    let isHeatMapEnable = false;

    let chart = createChart(chartContainer, array);

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
        speed = Math.min(speed + 1, 20);
        set_speed = Math.min(set_speed + 1, 20);
        speedLabel.textContent = `Speed: ${speed}`;
    });

    decreaseSpeedBtn.addEventListener('click', () => {
        speed = Math.max(speed - 1, 1);
        set_speed = Math.max(set_speed - 1, 1);
        speedLabel.textContent = `Speed: ${speed}`;
    });

    increaseSizeBtn.addEventListener('click', () => {
        size = Math.min(size + 5, 500);
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

    runBtn.addEventListener('click', async () => {
        if (isRunning) return;
        const selectedAlgorithms = JSON.parse(localStorage.getItem("selectedAlgorithms"));
        const [algorithm1, algorithm2] = selectedAlgorithms;
        console.log(algorithm1, algorithm2)
        console.log("Starting sort - disabling reset button");
        isRunning = true;
        resetBtn.disabled = true;  // Disable at start
        resetBtn.style.cursor = "not-allowed";
        shuffleBtn.disabled = true;  // Disable at start
        shuffleBtn.style.cursor = "not-allowed";
        createArrayBtn.disabled = true;  // Disable at start
        createArrayBtn.style.cursor = "not-allowed";
        const selectedAlgorithm = algorithmSelect.value;
        try {
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
                    resetBtn.disabled = false;
                    resetBtn.style.cursor = "pointer";
                    shuffleBtn.disabled = false;
                    shuffleBtn.style.cursor = "pointer";
                    createArrayBtn.disabled = false;  // Disable at start
                    createArrayBtn.style.cursor = "pointer";
                    break;
            }
        } catch (error) {
            console.error("Sorting error:", error);
            isRunning = false;
            resetBtn.disabled = false;
            resetBtn.style.cursor = "pointer";
            shuffleBtn.disabled = false;
            shuffleBtn.style.cursor = "pointer";
            createArrayBtn.disabled = false;  // Disable at start
            createArrayBtn.style.cursor = "pointer";
        }
    });
    const delayFactors = {
        bubbleSort: 1,  // Base delay factor
        selectionSort: 1,  // Base delay factor
        insertionSort: 0.9,  // Slightly faster due to fewer operations
        mergeSort: 0.5,  // Reduced delay to simulate log n overhead
        quickSort: 0.5   // Reduced delay to simulate log n overhead
    };
    
    function delay(ms, factor = 1) {
        return new Promise((resolve) => setTimeout(resolve, ms * factor));
    }

    function bubbleSort(array) {
        return new Promise((resolve) => {
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
                    resetBtn.disabled = false;
                    resetBtn.style.cursor = "pointer";
                    shuffleBtn.disabled = false;
                    shuffleBtn.style.cursor = "pointer";
                    createArrayBtn.disabled = false;  // Disable at start
                    createArrayBtn.style.cursor = "pointer";
                    console.log("Bubble sort complete - enabling reset button");
                    resolve();
                }
            }, 1000 / speed * delayFactors.bubbleSort);
        });
    }
    function selectionSort(array) {
        return new Promise((resolve) => {
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
                    resetBtn.disabled = false;
                    resetBtn.style.cursor = "pointer";
                    shuffleBtn.disabled = false;
                    shuffleBtn.style.cursor = "pointer";
                    createArrayBtn.disabled = false;  // Disable at start
                    createArrayBtn.style.cursor = "pointer";
                    console.log("Selection sort complete - enabling reset button");
                    resolve();
                }
            }, 1000 / speed * delayFactors.selectionSort);
        });
    }

    function insertionSort(array) {
        return new Promise((resolve) => {
            let n = array.length;
            let i = 1;

            let interval = setInterval(() => {
                if (i < n) {
                    let key = array[i];
                    let j = i - 1;
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
                    resetBtn.disabled = false;
                    resetBtn.style.cursor = "pointer";
                    shuffleBtn.disabled = false;
                    shuffleBtn.style.cursor = "pointer";
                    createArrayBtn.disabled = false;  // Disable at start
                    createArrayBtn.style.cursor = "pointer";
                    console.log("Insertion sort complete - enabling reset button");
                    resolve();
                }
            }, 1000 / speed * delayFactors.insertionSort);
        });
    }

    async function quickSort(array, left, right) {
        if (left < right) {
            let pivotIndex = await partition(array, left, right);
            updateChartData(array, [pivotIndex]);
            await quickSort(array, left, pivotIndex - 1);
            await quickSort(array, pivotIndex + 1, right);
        }

        if (left === 0 && right === array.length - 1) {
            setAllColor('#66BB6A');
            isRunning = false;
            resetBtn.disabled = false;
            resetBtn.style.cursor = "pointer";
            shuffleBtn.disabled = false;
            shuffleBtn.style.cursor = "pointer";
            createArrayBtn.disabled = false;  // Disable at start
            createArrayBtn.style.cursor = "pointer";
            console.log("Quick sort complete - enabling reset button");
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
                await delay(1000 / speed, delayFactors.quickSort); // Add delay for visualization
            }
        }
        [array[i + 1], array[right]] = [array[right], array[i + 1]];
        updateChartData(array, [i + 1, right]); // Highlight final position of the pivot
        await delay(1000 / speed, delayFactors.quickSort); // Add delay for visualization
        return i + 1;
    }

    async function mergeSort(array, left, right) {
        if (left < right) {
            let mid = Math.floor((left + right) / 2);
            await mergeSort(array, left, mid);
            await mergeSort(array, mid + 1, right);
            await merge(array, left, mid, right);
        }

        if (left === 0 && right === array.length - 1) {
            setAllColor('#66BB6A');
            isRunning = false;
            resetBtn.disabled = false;
            resetBtn.style.cursor = "pointer";
            shuffleBtn.disabled = false;
            shuffleBtn.style.cursor = "pointer";
            createArrayBtn.disabled = false;  // Disable at start
            createArrayBtn.style.cursor = "pointer";
            console.log("Merge sort complete - enabling reset button");
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
            await delay(1000 / speed, delayFactors.mergeSort); // Add delay for visualization
        }
    
        while (i < leftArr.length) {
            array[k++] = leftArr[i++];
            updateChartData(array, [k - 1]);
            await delay(1000 / speed, delayFactors.mergeSort);
        }
    
        while (j < rightArr.length) {
            array[k++] = rightArr[j++];
            updateChartData(array, [k - 1]);
            await delay(1000 / speed, delayFactors.mergeSort);
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
    
    const canvasContainer = document.querySelector(".chart-container");
    let chart1 = null;
    let chart2 = null;

    compare.addEventListener('click', () => {
        showCardPopup();
        console.log("compare : ",isHeatMapEnable);
        heatMapBtn.textContent = isHeatMapEnable ? "Hide Heat-Map 📊" : "Show Heat-Map 📊";
        if (!document.getElementById("additionalCanvas1") && !document.getElementById("additionalCanvas2")) {
            const defaultCanvas = document.getElementById("chart");
            if (defaultCanvas) {
                canvasContainer.removeChild(defaultCanvas);
            }

            const canvas1 = document.createElement("canvas");
            canvas1.id = "additionalCanvas1";
            canvas1.width = 300;
            canvas1.height = 70;

            const canvas2 = document.createElement("canvas");
            canvas2.id = "additionalCanvas2";
            canvas2.width = 300;
            canvas2.height = 70;

            canvasContainer.appendChild(canvas1);
            canvasContainer.appendChild(canvas2);
            canvasContainer.style.gap = "10px";

            window.chart1 = generateBarGraph("additionalCanvas1", 50, false);
            window.chart2 = generateBarGraph("additionalCanvas2", 50, false);

            // const chart1 = generateBarGraph("additionalCanvas1", 50, false);
            // const chart2 = generateBarGraph("additionalCanvas2", 50, false);

            createArrayBtn.addEventListener("click", () => {
                const newArray = Array.from({ length: 50 }, () => Math.floor(Math.random() * 100) + 1);
                updateChart_Data(window.chart1.chart, newArray);
                updateChart_Data(window.chart2.chart, newArray);
            });

            increaseSpeedBtn.addEventListener('click', () => {
                speed = Math.min(speed + 1, 20);
                speedLabel.textContent = `Speed: ${speed}`;
            });
        
            decreaseSpeedBtn.addEventListener('click', () => {
                speed = Math.max(speed - 1, 1);
                speedLabel.textContent = `Speed: ${speed}`;
            });
        
            increaseSizeBtn.addEventListener('click', () => {
                size = Math.min(size + 5, 500);
                array = generateArray(size);
                updateChart_Data(window.chart1.chart, array ,[], isHeatMapEnable);
                updateChart_Data(window.chart2.chart, array ,[], isHeatMapEnable);
                arraySizeLabel.textContent = `Array Size: ${size}`;
            });
        
            decreaseSizeBtn.addEventListener('click', () => {
                size = Math.max(size - 5, 5);
                array = generateArray(size);
                // updateChartData(array);
                updateChart_Data(window.chart1.chart, array ,[], isHeatMapEnable);
                updateChart_Data(window.chart2.chart, array ,[], isHeatMapEnable);
                arraySizeLabel.textContent = `Array Size: ${size}`;
            });
            heatMapBtn.addEventListener("click", () => {
                isHeatMapEnable = !isHeatMapEnable;
                heatMapBtn.textContent = isHeatMapEnable ? "Hide Heat-Map 📊" : "Show Heat-Map 📊";
                localStorage.setItem("isHeatMapEnable", JSON.stringify(isHeatMapEnable));
                if (window.chart1) {
                    updateChart_Data(
                        window.chart1.chart,
                        window.chart1.chart.data.datasets[0].data,
                        [], // No active indexes
                        isHeatMapEnable // Apply heat map colors
                    );
                }
                if (window.chart2) {
                    updateChart_Data(
                        window.chart2.chart,
                        window.chart2.chart.data.datasets[0].data,
                        [], // No active indexes
                        isHeatMapEnable // Apply heat map colors
                    );
                }
            });
            
            resetBtn.addEventListener('click', () => {
                array = generateArray(size);
                updateChart_Data(window.chart1.chart, array ,[], isHeatMapEnable);
                updateChart_Data(window.chart2.chart, array ,[], isHeatMapEnable);
            });
            
            shuffleBtn.addEventListener('click', () => {
                array = shuffleArray(array);
                updateChart_Data(window.chart1.chart, array ,[], isHeatMapEnable);
                updateChart_Data(window.chart2.chart, array ,[], isHeatMapEnable);
            });
        
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
        
        }
    });

    async function executeAlgorithmOnCanvas(algorithm, array, chart) {
        if (!algorithm) {
            throw new Error(`Unknown algorithm: ${algorithm}`);
        }
        
        switch (algorithm) {
            case "bubbleSort":
                await _bubbleSort(array, chart, set_speed  );
                break;
            case "selectionSort":
                await _selectionSort(array, chart, set_speed  );
                break;
            case "insertionSort":
                await _insertionSort(array, chart, set_speed );
                break;
            case "quickSort":
                await _quickSort(array, chart, 0, array.length - 1, set_speed );
                break;
            case "mergeSort":
                await _mergeSort(array, chart, 0, array.length - 1, set_speed );
                break;
            default:
                throw new Error(`Unknown algorithm: ${algorithm}`);
        }
        if (isHeatMapEnable) {
            updateChart_Data(chart, array, [], isHeatMapEnable);
        } else {
            setAllColor(chart, "#66BB6A"); // Green for sorted
        }
    }
    
    compare_run.addEventListener('click', async () => {

        console.log('s:',isRunning_in_Comparision_mode);
        if(isRunning_in_Comparision_mode) return;
        isRunning_in_Comparision_mode = true;
        console.log('s:',isRunning_in_Comparision_mode);
        console.log(resetBtn , shuffleBtn);
        resetBtn.disabled = true;
        resetBtn.style.cursor = "not-allowed";
        shuffleBtn.disabled = true;
        shuffleBtn.style.cursor = "not-allowed";
        createArrayBtn.disabled = true;
        createArrayBtn.style.cursor = "not-allowed";
        runBtn.disabled = true;
        runBtn.style.cursor = "not-allowed";
        compare.disabled = true;
        compare.style.cursor = "not-allowed";

        console.log("compareKr :- ",isHeatMapEnable);
        const algos = {
            "Bubble Sort": "bubbleSort",
            "Merge Sort": "mergeSort",
            "Quick Sort": "quickSort",
            "Insertion Sort": "insertionSort",
            "Selection Sort": "selectionSort"
        };
    
        const selectedAlgorithms = JSON.parse(localStorage.getItem("selectedAlgorithms"));
        if (!selectedAlgorithms || selectedAlgorithms.length < 2) {
            alert("Please select at least two sorting algorithms.");
            isRunning_in_Comparision_mode = false;
            return;
        }
        const [algorithm1, algorithm2] = selectedAlgorithms;
    
        if (!algorithm1 || !algorithm2) {
            console.error("Selected algorithms are not valid:", selectedAlgorithms);
            resetBtn.disabled = false;
            resetBtn.style.cursor = "pointer";
            shuffleBtn.disabled = false;
            shuffleBtn.style.cursor = "pointer";
            createArrayBtn.disabled = false;
            createArrayBtn.style.cursor = "pointer";
            runBtn.disabled = false;
            runBtn.style.cursor = "pointer";
            compare.disabled = false;
            compare.style.cursor = "pointer";
            
            isRunning_in_Comparision_mode = false;
            return;
        }
    
        console.log("Selected algorithms:", algorithm1, algorithm2);
        algoLabel.textContent = `Running - ${algorithm1} Vs ${algorithm2}`
    
        // creates independent copies of the array
        const array1 = [...array];
        const array2 = [...array];

        try {
            // executes sorting algorithms in parallel on their respective charts
            const canvas1Promise = executeAlgorithmOnCanvas(algos[algorithm1], array1, window.chart1.chart);
            const canvas2Promise = executeAlgorithmOnCanvas(algos[algorithm2], array2, window.chart2.chart);

            await Promise.all([canvas1Promise, canvas2Promise]);

            console.log("Both algorithms completed execution.");

        } catch (error) {
            console.error("Sorting error:", error);
        } finally{
            resetBtn.disabled = false;
            resetBtn.style.cursor = "pointer";
            shuffleBtn.disabled = false;
            shuffleBtn.style.cursor = "pointer";
            createArrayBtn.disabled = false;
            createArrayBtn.style.cursor = "pointer";
            runBtn.disabled = false;
            runBtn.style.cursor = "pointer";
            compare.disabled = false;
            compare.style.cursor = "pointer";
            isRunning_in_Comparision_mode = false;
        }
        console.log("Final sorted arrays:", array1, array2);
    });
    
});
