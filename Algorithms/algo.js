import { updateChart_Data } from '../Operations/updateChart.js';
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

let isHeatMapEnable = false;

function _bubbleSort(array, chart, speed) {
    return new Promise((resolve) => {
        let n = array.length;
        let i = 0, j = 0;

        function runBubbleSortStep() {
            if (i < n - 1) {
                if (j < n - i - 1) {
                    if (array[j] > array[j + 1]) {
                        [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    }
                    updateChart_Data(chart, array, [j, j + 1], isHeatMapEnable);
                    j++;
                } else {
                    j = 0;
                    i++;
                }
            } else {
                setAllColor(chart, '#66BB6A');
                resolve();
                return;
            }
            setTimeout(runBubbleSortStep, 1000 / speed * delayFactors.bubbleSort);
        }

        runBubbleSortStep();
    });
}

function _selectionSort(array, chart, speed) {
    return new Promise((resolve) => {
        let n = array.length;
        let i = 0, j = i + 1, minIndex = 0;

        function runSelectionSortStep() {
            if (i < n - 1) {
                if (j < n) {
                    if (array[j] < array[minIndex]) {
                        minIndex = j;
                    }
                    updateChart_Data(chart, array, [j, minIndex] , isHeatMapEnable);
                    j++;
                } else {
                    if (minIndex !== i) {
                        [array[i], array[minIndex]] = [array[minIndex], array[i]];
                    }
                    setColor(chart, i, '#66BB6A');
                    i++;
                    j = i + 1;
                    minIndex = i;
                }
            } else {
                setAllColor(chart, '#66BB6A');
                resolve();
                return;
            }
            setTimeout(runSelectionSortStep, 1000 / speed * delayFactors.selectionSort);
        }

        runSelectionSortStep();
    });
}

function _insertionSort(array, chart, speed) {
    return new Promise((resolve) => {
        let n = array.length;
        let i = 1;

        function runInsertionSortStep() {
            if (i < n) {
                let key = array[i];
                let j = i - 1;
                while (j >= 0 && array[j] > key) {
                    array[j + 1] = array[j];
                    j--;
                }
                array[j + 1] = key;
                updateChart_Data(chart, array, [i, j + 1],isHeatMapEnable);
                setColor(chart, i, '#66BB6A');
                i++;
            } else {
                setAllColor(chart, '#66BB6A');
                resolve();
                return;
            }
            setTimeout(runInsertionSortStep, 1000 / speed * delayFactors.selectionSort);
        }

        runInsertionSortStep();
    });
}

async function _quickSort(array, chart, left, right, speed) {
    if (left < right) {
        let pivotIndex = await _partition(array, chart, left, right, speed);
        updateChart_Data(chart, array, [pivotIndex],isHeatMapEnable);
        await _quickSort(array, chart, left, pivotIndex - 1, speed);
        await _quickSort(array, chart, pivotIndex + 1, right, speed);
    }

    if (left === 0 && right === array.length - 1) {
        setAllColor(chart, '#66BB6A');
    }
}

async function _partition(array, chart, left, right, speed) {
    let pivot = array[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            updateChart_Data(chart, array, [i, j],isHeatMapEnable);
            await delay(1000 / speed, delayFactors.quickSort);
        }
    }
    [array[i + 1], array[right]] = [array[right], array[i + 1]];
    updateChart_Data(chart, array, [i + 1, right],isHeatMapEnable);
    await delay(1000 / speed, delayFactors.quickSort);
    return i + 1;
}

async function _mergeSort(array, chart, left, right, speed) {
    if (left < right) {
        let mid = Math.floor((left + right) / 2);
        await _mergeSort(array, chart, left, mid, speed);
        await _mergeSort(array, chart, mid + 1, right, speed);
        await _merge(array, chart, left, mid, right, speed);
    }

    if (left === 0 && right === array.length - 1) {
        setAllColor(chart, '#66BB6A');
    }
}

async function _merge(array, chart, left, mid, right, speed) {
    let leftArr = array.slice(left, mid + 1);
    let rightArr = array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
            array[k++] = leftArr[i++];
        } else {
            array[k++] = rightArr[j++];
        }
        updateChart_Data(chart, array, [k - 1],isHeatMapEnable);
        await delay(1000 / speed, delayFactors.mergeSort);
    }

    while (i < leftArr.length) {
        array[k++] = leftArr[i++];
        updateChart_Data(chart, array, [k - 1],isHeatMapEnable);
        await delay(1000 / speed, delayFactors.mergeSort);
    }

    while (j < rightArr.length) {
        array[k++] = rightArr[j++];
        updateChart_Data(chart, array, [k - 1],isHeatMapEnable);
        await delay(1000 / speed, delayFactors.mergeSort);
    }
}

// Helper functions
function setAllColor(chart, color) {
    chart.data.datasets[0].backgroundColor = Array(chart.data.datasets[0].data.length).fill(color);
    chart.update();
}
function setColor(chart, index, color) {
    chart.data.datasets[0].backgroundColor[index] = color;
    chart.update();
}

export { _bubbleSort, _selectionSort, _insertionSort, _quickSort, _mergeSort };