/**
 * Sorting Algorithms Implementation
 */

class SortingAlgorithms {
    constructor() {
        // Initialize statistics
        this.comparisons = 0;
        this.swaps = 0;
        this.accesses = 0;
        this.memoryUsage = 0;
        this.maxMemoryUsage = 0;
        this.memoryTracker = [];
        
        // Time and space complexity information
        this.complexities = {
            bubble: { time: "O(n²)", space: "O(1)" },
            insertion: { time: "O(n²)", space: "O(1)" },
            selection: { time: "O(n²)", space: "O(1)" },
            merge: { time: "O(n log n)", space: "O(n)" },
            quick: { time: "O(n log n) avg", space: "O(log n) avg" },
            heap: { time: "O(n log n)", space: "O(1)" },
            radix: { time: "O(nk)", space: "O(n + k)" },
            shell: { time: "O(n log² n)", space: "O(1)" },
            comb: { time: "O(n²)", space: "O(1)" },
            cocktail: { time: "O(n²)", space: "O(1)" }
        };
        
        // Algorithm descriptions
        this.descriptions = {
            bubble: "Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
            insertion: "Insertion sort builds the final sorted array one item at a time. It's much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort but can be efficient for small data sets, especially if partially sorted.",
            selection: "Selection sort divides the input list into two parts: a sorted sublist of items which is built up from left to right and a sublist of the remaining unsorted items. The algorithm repeatedly selects the smallest element from the unsorted sublist and moves it to the end of the sorted sublist.",
            merge: "Merge sort is an efficient, stable, comparison-based, divide and conquer sorting algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.",
            quick: "Quick sort is an efficient sorting algorithm that uses a divide-and-conquer strategy. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.",
            heap: "Heap sort is a comparison-based sorting algorithm that uses a binary heap data structure. It divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element and moving it to the sorted region.",
            radix: "Radix sort is a non-comparative sorting algorithm that sorts data with integer keys by grouping keys by individual digits which share the same position and value. It processes the digits from the least significant digit to the most significant digit.",
            shell: "Shell sort is an optimization of insertion sort that allows the exchange of items that are far apart. The idea is to arrange the list of elements so that, starting anywhere, taking every hth element produces a sorted list.",
            comb: "Comb sort is a relatively simple sorting algorithm and improves on bubble sort by using a gap sequence to remove small values at the end of the list. It eliminates turtles, or small values near the end of the list, which are known to greatly slow bubble sort.",
            cocktail: "Cocktail shaker sort, also known as bidirectional bubble sort, is a variation of bubble sort that sorts in both directions on each pass through the list. This sorting algorithm is only marginally more difficult to implement than bubble sort, and solves the problem of turtles effectively."
        };
    }
    
    // Reset statistics
    resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        this.accesses = 0;
        this.memoryUsage = 0;
        this.maxMemoryUsage = 0;
        this.memoryTracker = [];
    }
    
    // Track memory allocations
    allocateMemory(size, actions) {
        this.memoryUsage += size;
        this.maxMemoryUsage = Math.max(this.maxMemoryUsage, this.memoryUsage);
        this.memoryTracker.push({
            operation: 'allocate',
            size: size,
            currentUsage: this.memoryUsage
        });
        
        // Add memory action
        if (actions) {
            actions.push({
                type: 'memory',
                operation: 'allocate',
                size: size,
                current: this.memoryUsage,
                codeDescription: 'Allocating memory',
                pseudocode: 'new Array(size)'
            });
        }
    }
    
    // Track memory deallocations
    deallocateMemory(size, actions) {
        this.memoryUsage -= size;
        this.memoryTracker.push({
            operation: 'deallocate',
            size: size,
            currentUsage: this.memoryUsage
        });
        
        // Add memory action
        if (actions) {
            actions.push({
                type: 'memory',
                operation: 'deallocate',
                size: size,
                current: this.memoryUsage,
                codeDescription: 'Releasing memory',
                pseudocode: 'free(array)'
            });
        }
    }
    
    // Helper methods for tracking operations
    compare(arr, i, j, actions) {
        this.comparisons++;
        this.access(arr, i, actions);
        this.access(arr, j, actions);
        
        // Add comparison action
        actions.push({
            type: 'comparison',
            indices: [i, j],
            codeDescription: 'Comparing elements',
            pseudocode: 'if (array[i] > array[j])'
        });
        
        return arr[i] > arr[j];
    }
    
    swap(arr, i, j, actions) {
        this.swaps++;
        
        // Perform the swap
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        
        // Add swap action
        actions.push({
            type: 'swap',
            indices: [i, j],
            values: [arr[i], arr[j]],
            codeDescription: 'Swapping elements',
            pseudocode: 'swap(array[i], array[j])'
        });
    }
    
    access(arr, i, actions) {
        this.accesses++;
        
        // Add access action
        actions.push({
            type: 'access',
            indices: [i],
            codeDescription: 'Accessing array element',
            pseudocode: 'value = array[i]'
        });
        
        return arr[i];
    }
    
    assign(arr, i, value, actions) {
        arr[i] = value;
        
        // Add assignment action
        actions.push({
            type: 'assignment',
            indices: [i],
            values: [value],
            codeDescription: 'Assigning value to array element',
            pseudocode: 'array[i] = value'
        });
    }
    
    // Bubble Sort
    bubbleSort(arr) {
        const actions = [];
        const n = arr.length;
        const arrayCopy = [...arr];
        
        this.resetStats();
        
        for (let i = 0; i < n; i++) {
            let swapped = false;
            
            for (let j = 0; j < n - i - 1; j++) {
                if (this.compare(arrayCopy, j, j + 1, actions)) {
                    this.swap(arrayCopy, j, j + 1, actions);
                    swapped = true;
                }
            }
            
            // If no swapping occurred in this pass, array is sorted
            if (!swapped) break;
        }
        
        return {
            sortedArray: arrayCopy,
            actions: actions
        };
    }
    
    // Insertion Sort
    insertionSort(arr) {
        const actions = [];
        const n = arr.length;
        const arrayCopy = [...arr];
        
        this.resetStats();
        
        for (let i = 1; i < n; i++) {
            const key = this.access(arrayCopy, i, actions);
            let j = i - 1;
            
            while (j >= 0 && this.access(arrayCopy, j, actions) > key) {
                this.assign(arrayCopy, j + 1, arrayCopy[j], actions);
                j--;
            }
            
            this.assign(arrayCopy, j + 1, key, actions);
        }
        
        return {
            sortedArray: arrayCopy,
            actions: actions
        };
    }
    
    // Selection Sort
    selectionSort(arr) {
        const actions = [];
        const n = arr.length;
        const arrayCopy = [...arr];
        
        this.resetStats();
        
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            
            for (let j = i + 1; j < n; j++) {
                if (this.compare(arrayCopy, minIdx, j, actions)) {
                    minIdx = j;
                }
            }
            
            if (minIdx !== i) {
                this.swap(arrayCopy, i, minIdx, actions);
            }
        }
        
        return {
            sortedArray: arrayCopy,
            actions: actions
        };
    }
    
    // Merge Sort
    mergeSort(arr) {
        const actions = [];
        const arrayCopy = [...arr];
        
        this.resetStats();
        
        const merge = (arr, left, mid, right) => {
            const n1 = mid - left + 1;
            const n2 = right - mid;
            
            // Create temp arrays - track memory allocation
            this.allocateMemory(n1, actions);
            this.allocateMemory(n2, actions);
            const L = new Array(n1);
            const R = new Array(n2);
            
            // Copy data to temp arrays
            for (let i = 0; i < n1; i++) {
                L[i] = this.access(arr, left + i, actions);
            }
            
            for (let j = 0; j < n2; j++) {
                R[j] = this.access(arr, mid + 1 + j, actions);
            }
            
            // Merge the temp arrays back
            let i = 0, j = 0, k = left;
            
            while (i < n1 && j < n2) {
                if (L[i] <= R[j]) {
                    this.assign(arr, k, L[i], actions);
                    i++;
                } else {
                    this.assign(arr, k, R[j], actions);
                    j++;
                }
                k++;
            }
            
            // Copy remaining elements
            while (i < n1) {
                this.assign(arr, k, L[i], actions);
                i++;
                k++;
            }
            
            while (j < n2) {
                this.assign(arr, k, R[j], actions);
                j++;
                k++;
            }
            
            // Deallocate memory
            this.deallocateMemory(n1, actions);
            this.deallocateMemory(n2, actions);
        };
        
        const mergeSortHelper = (arr, left, right) => {
            if (left < right) {
                const mid = Math.floor(left + (right - left) / 2);
                
                // Sort first and second halves
                mergeSortHelper(arr, left, mid);
                mergeSortHelper(arr, mid + 1, right);
                
                // Merge the sorted halves
                merge(arr, left, mid, right);
            }
        };
        
        mergeSortHelper(arrayCopy, 0, arrayCopy.length - 1);
        
        return {
            sortedArray: arrayCopy,
            actions: actions
        };
    }
    
    // Quick Sort
    quickSort(arr) {
        const actions = [];
        const arrayCopy = [...arr];
        
        this.resetStats();
        
        const partition = (arr, low, high) => {
            const pivot = this.access(arr, high, actions);
            let i = low - 1;
            
            for (let j = low; j < high; j++) {
                if (this.access(arr, j, actions) <= pivot) {
                    i++;
                    this.swap(arr, i, j, actions);
                }
            }
            
            this.swap(arr, i + 1, high, actions);
            return i + 1;
        };
        
        const quickSortHelper = (arr, low, high, depth = 0) => {
            // Track recursion stack memory
            if (depth > 0) {
                this.allocateMemory(1, actions); // Allocate memory for stack frame
            }
            
            if (low < high) {
                const pi = partition(arr, low, high);
                
                // Recursively sort elements before and after partition
                quickSortHelper(arr, low, pi - 1, depth + 1);
                quickSortHelper(arr, pi + 1, high, depth + 1);
            }
            
            // Deallocate memory when returning from recursion
            if (depth > 0) {
                this.deallocateMemory(1, actions);
            }
        };
        
        quickSortHelper(arrayCopy, 0, arrayCopy.length - 1);
        
        return {
            sortedArray: arrayCopy,
            actions: actions
        };
    }
    
    // Heap Sort
    heapSort(arr) {
        const actions = [];
        const arrayCopy = [...arr];
        const n = arrayCopy.length;
        
        this.resetStats();
        
        // Build heap (rearrange array)
        const heapify = (arr, n, i) => {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            
            if (left < n && this.compare(arr, largest, left, actions)) {
                largest = left;
            }
            
            if (right < n && this.compare(arr, largest, right, actions)) {
                largest = right;
            }
            
            if (largest !== i) {
                this.swap(arr, i, largest, actions);
                heapify(arr, n, largest);
            }
        };
        
        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(arrayCopy, n, i);
        }
        
        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            this.swap(arrayCopy, 0, i, actions);
            heapify(arrayCopy, i, 0);
        }
        
        return {
            sortedArray: arrayCopy,
            actions: actions
        };
    }
    
    // Shell Sort
    shellSort(arr) {
        const actions = [];
        const arrayCopy = [...arr];
        const n = arrayCopy.length;
        
        this.resetStats();
        
        // Start with a big gap, then reduce the gap
        for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
            // Do a gapped insertion sort
            for (let i = gap; i < n; i++) {
                const temp = this.access(arrayCopy, i, actions);
                
                let j;
                for (j = i; j >= gap && this.access(arrayCopy, j - gap, actions) > temp; j -= gap) {
                    this.assign(arrayCopy, j, arrayCopy[j - gap], actions);
                }
                
                this.assign(arrayCopy, j, temp, actions);
            }
        }
        
        return {
            sortedArray: arrayCopy,
            actions: actions
        };
    }
    
    // Comb Sort
    combSort(arr) {
        const actions = [];
        const arrayCopy = [...arr];
        const n = arrayCopy.length;
        
        this.resetStats();
        
        let gap = n;
        const shrink = 1.3;
        let sorted = false;
        
        while (!sorted) {
            // Update gap
            gap = Math.floor(gap / shrink);
            if (gap <= 1) {
                gap = 1;
                sorted = true;
            }
            
            // Comb through the array
            for (let i = 0; i + gap < n; i++) {
                if (this.compare(arrayCopy, i, i + gap, actions)) {
                    this.swap(arrayCopy, i, i + gap, actions);
                    sorted = false;
                }
            }
        }
        
        return {
            sortedArray: arrayCopy,
            actions: actions
        };
    }
    
    // Cocktail Sort (Bidirectional Bubble Sort)
    cocktailSort(arr) {
        const actions = [];
        const arrayCopy = [...arr];
        const n = arrayCopy.length;
        
        this.resetStats();
        
        let swapped = true;
        let start = 0;
        let end = n - 1;
        
        while (swapped) {
            // Reset swapped flag for forward pass
            swapped = false;
            
            // Forward pass (like bubble sort)
            for (let i = start; i < end; i++) {
                if (this.compare(arrayCopy, i, i + 1, actions)) {
                    this.swap(arrayCopy, i, i + 1, actions);
                    swapped = true;
                }
            }
            
            if (!swapped) break;
            
            // Reset swapped flag for backward pass
            swapped = false;
            
            // Decrease end because the largest element is at the end
            end--;
            
            // Backward pass (bubble from right to left)
            for (let i = end - 1; i >= start; i--) {
                if (this.compare(arrayCopy, i, i + 1, actions)) {
                    this.swap(arrayCopy, i, i + 1, actions);
                    swapped = true;
                }
            }
            
            // Increase start because the smallest element is at the start
            start++;
        }
        
        return {
            sortedArray: arrayCopy,
            actions: actions
        };
    }
    
    // Radix Sort (for non-negative integers)
    radixSort(arr) {
        const actions = [];
        const arrayCopy = [...arr];
        
        this.resetStats();
        
        // Find the maximum number to know number of digits
        let max = 0;
        for (let i = 0; i < arrayCopy.length; i++) {
            max = Math.max(max, this.access(arrayCopy, i, actions));
        }
        
        // Do counting sort for every digit
        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            this.countingSort(arrayCopy, exp, actions);
        }
        
        return {
            sortedArray: arrayCopy,
            actions: actions
        };
    }
    
    // Counting Sort (helper for Radix Sort)
    countingSort(arr, exp, actions) {
        const n = arr.length;
        const output = new Array(n).fill(0);
        const count = new Array(10).fill(0);
        
        // Store count of occurrences
        for (let i = 0; i < n; i++) {
            const index = Math.floor(this.access(arr, i, actions) / exp) % 10;
            count[index]++;
        }
        
        // Change count[i] so that count[i] contains position of this digit in output[]
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
        
        // Build the output array
        for (let i = n - 1; i >= 0; i--) {
            const index = Math.floor(this.access(arr, i, actions) / exp) % 10;
            output[count[index] - 1] = arr[i];
            count[index]--;
        }
        
        // Copy the output array to arr
        for (let i = 0; i < n; i++) {
            this.assign(arr, i, output[i], actions);
        }
    }
    
    // Get complexity information for an algorithm
    getComplexity(algorithm) {
        return this.complexities[algorithm] || { time: "Unknown", space: "Unknown" };
    }
    
    // Get description for an algorithm
    getDescription(algorithm) {
        return this.descriptions[algorithm] || "No description available.";
    }
    
    // Run a sorting algorithm by name
    runAlgorithm(algorithm, array) {
        switch (algorithm) {
            case 'bubble':
                return this.bubbleSort(array);
            case 'insertion':
                return this.insertionSort(array);
            case 'selection':
                return this.selectionSort(array);
            case 'merge':
                return this.mergeSort(array);
            case 'quick':
                return this.quickSort(array);
            case 'heap':
                return this.heapSort(array);
            case 'shell':
                return this.shellSort(array);
            case 'comb':
                return this.combSort(array);
            case 'cocktail':
                return this.cocktailSort(array);
            case 'radix':
                return this.radixSort(array);
            default:
                return this.bubbleSort(array);
        }
    }
    
    // Get current statistics
    getStats() {
        return {
            comparisons: this.comparisons,
            swaps: this.swaps,
            accesses: this.accesses,
            memoryUsage: this.memoryUsage,
            maxMemoryUsage: this.maxMemoryUsage,
            memoryTracker: this.memoryTracker
        };
    }
} 