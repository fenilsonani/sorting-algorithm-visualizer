/**
 * Sorting Visualizer
 * Handles the visualization of sorting algorithms
 */

class SortingVisualizer {
    constructor() {
        // DOM elements
        this.visualizationContainer = document.getElementById('visualization');
        this.algorithmSelect = document.getElementById('algorithm');
        this.sizeInput = document.getElementById('size');
        this.sizeValue = document.getElementById('size-value');
        this.speedInput = document.getElementById('speed');
        this.speedValue = document.getElementById('speed-value');
        this.distributionSelect = document.getElementById('distribution');
        this.showNumbersCheckbox = document.getElementById('show-numbers');
        this.showMetricsCheckbox = document.getElementById('show-metrics');
        this.darkModeCheckbox = document.getElementById('dark-mode');
        
        // Buttons
        this.generateButton = document.getElementById('generate');
        this.playButton = document.getElementById('play');
        this.pauseButton = document.getElementById('pause');
        this.stepButton = document.getElementById('step');
        this.resetButton = document.getElementById('reset');
        this.helpButton = document.getElementById('help-button');
        this.toggleMetricsButton = document.getElementById('toggle-metrics');
        
        // Info displays
        this.timeComplexity = document.getElementById('time-complexity');
        this.spaceComplexity = document.getElementById('space-complexity');
        this.comparisonsDisplay = document.getElementById('comparisons');
        this.swapsDisplay = document.getElementById('swaps');
        this.accessesDisplay = document.getElementById('array-accesses');
        this.memoryUsageDisplay = document.getElementById('memory-usage');
        this.algorithmTitle = document.getElementById('algorithm-title');
        this.algorithmDescription = document.getElementById('algorithm-description');
        
        // Modal elements
        this.helpModal = document.getElementById('help-modal');
        this.closeModalButtons = document.querySelectorAll('.close');
        
        // Metrics container
        this.metricsContainer = document.getElementById('metrics-container');
        
        // Chart elements
        this.operationsChart = document.getElementById('operationsChart');
        this.memoryChart = document.getElementById('memoryChart');
        
        // Check for Chart.js availability
        this.chartsAvailable = typeof Chart !== 'undefined';
        
        // If Chart.js is unavailable, show fallback UI
        if (!this.chartsAvailable) {
            console.warn('Chart.js not available. Using fallback UI for metrics.');
            if (this.metricsContainer) {
                const metricsChartsContainer = this.metricsContainer.querySelector('.metrics-charts');
                if (metricsChartsContainer) {
                    metricsChartsContainer.innerHTML = `
                        <div class="fallback-text">
                            <div>
                                <h3>Charts Unavailable</h3>
                                <p>Chart.js library failed to load. Basic metrics are still available above.</p>
                            </div>
                        </div>
                    `;
                }
            }
        }
        
        // Charts
        this.operationsChartInstance = null;
        this.memoryChartInstance = null;
        
        // Metrics data
        this.metricsData = {
            comparisons: [],
            swaps: [],
            accesses: [],
            memory: []
        };
        
        // Algorithm instance
        this.algorithms = new SortingAlgorithms();
        
        // Visualization state
        this.array = [];
        this.originalArray = [];
        this.sortingActions = [];
        this.currentActionIndex = -1;
        this.isSorting = false;
        this.isCompleted = false;
        this.animationSpeed = 50; // Default speed (milliseconds)
        this.metricsCollapsed = false;
        
        // Algorithm code
        this.algorithmCode = document.getElementById('algorithm-code');
        this.codeLanguageRadios = document.querySelectorAll('input[name="code-language"]');
        
        // Operation description
        this.operationDescription = document.createElement('div');
        this.operationDescription.className = 'operation-description';
        
        // Initialize the visualizer
        this.init();
    }
    
    init() {
        // Initialize with default values
        this.updateSpeed();
        this.generateArray();
        
        // Add operation description to the visualization container
        this.visualizationContainer.appendChild(this.operationDescription);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update the algorithm info
        this.updateAlgorithmInfo();
        
        // Initialize charts if available
        if (this.chartsAvailable) {
            this.initCharts();
        }
        
        // Initialize active speed button
        this.updateActiveSpeedButton();
    }
    
    setupEventListeners() {
        // Array generation and control
        this.sizeInput.addEventListener('input', () => {
            this.sizeValue.textContent = this.sizeInput.value;
            this.generateArray();
        });
        
        this.speedInput.addEventListener('input', () => {
            this.updateSpeed();
            this.updateActiveSpeedButton();
        });
        
        // Add event listeners for speed preset buttons
        document.querySelectorAll('.speed-btn').forEach(button => {
            button.addEventListener('click', () => {
                const speedValue = button.getAttribute('data-speed');
                this.speedInput.value = speedValue;
                this.updateSpeed();
                this.updateActiveSpeedButton();
            });
        });
        
        this.generateButton.addEventListener('click', () => {
            this.generateArray();
        });
        
        this.showNumbersCheckbox.addEventListener('change', () => {
            this.renderArray();
        });
        
        this.showMetricsCheckbox.addEventListener('change', () => {
            if (this.showMetricsCheckbox.checked) {
                this.metricsContainer.style.display = 'block';
            } else {
                this.metricsContainer.style.display = 'none';
            }
        });
        
        this.darkModeCheckbox.addEventListener('change', () => {
            document.body.classList.toggle('light-mode');
            if (this.chartsAvailable) {
                this.updateChartTheme();
            }
        });
        
        // Algorithm selection
        this.algorithmSelect.addEventListener('change', () => {
            this.updateAlgorithmInfo();
            this.resetSorting();
        });
        
        this.distributionSelect.addEventListener('change', () => {
            this.generateArray();
        });
        
        // Sorting controls
        this.playButton.addEventListener('click', () => {
            this.startSorting();
        });
        
        this.pauseButton.addEventListener('click', () => {
            this.pauseSorting();
        });
        
        this.stepButton.addEventListener('click', () => {
            this.stepForward();
        });
        
        this.resetButton.addEventListener('click', () => {
            this.resetSorting();
        });
        
        // Help modal
        this.helpButton.addEventListener('click', () => {
            this.helpModal.style.display = 'block';
        });
        
        // Close modals
        this.closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.helpModal.style.display = 'none';
            });
        });
        
        window.addEventListener('click', (event) => {
            if (event.target === this.helpModal) {
                this.helpModal.style.display = 'none';
            }
        });
        
        // Toggle metrics
        this.toggleMetricsButton.addEventListener('click', () => {
            this.metricsCollapsed = !this.metricsCollapsed;
            if (this.metricsCollapsed) {
                this.metricsContainer.classList.add('collapsed');
                this.toggleMetricsButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
            } else {
                this.metricsContainer.classList.remove('collapsed');
                this.toggleMetricsButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
            }
        });
        
        // Code language toggle
        this.codeLanguageRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateAlgorithmCode();
            });
        });
    }
    
    updateSpeed() {
        // Get the slider value
        const speedValue = parseInt(this.speedInput.value);
        this.speedValue.textContent = speedValue;
        
        // Create more granular speed mapping with improved range
        // Values from 1-300 now map to different speeds
        if (speedValue <= 60) {
            // Very slow: 500-400ms
            this.animationSpeed = 500 - (speedValue * 5/3);
        } else if (speedValue <= 120) {
            // Slow: 400-200ms
            this.animationSpeed = 400 - ((speedValue - 60) * 10/3);
        } else if (speedValue <= 180) {
            // Medium: 200-50ms
            this.animationSpeed = 200 - ((speedValue - 120) * 7.5/3);
        } else if (speedValue <= 240) {
            // Fast: 50-10ms
            this.animationSpeed = 50 - ((speedValue - 180) * 2/3);
        } else {
            // Very fast: 10-1ms
            this.animationSpeed = 10 - ((speedValue - 240) * 0.15);
        }
        
        // Ensure minimum speed of 1ms
        this.animationSpeed = Math.max(1, Math.floor(this.animationSpeed));
    }
    
    updateActiveSpeedButton() {
        // Remove active class from all buttons
        document.querySelectorAll('.speed-btn').forEach(button => {
            button.classList.remove('active');
        });
        
        // Get current speed value
        const speedValue = parseInt(this.speedInput.value);
        
        // Find closest speed preset button
        let closestButton = null;
        let minDiff = 300;
        
        document.querySelectorAll('.speed-btn').forEach(button => {
            const btnSpeed = parseInt(button.getAttribute('data-speed'));
            const diff = Math.abs(btnSpeed - speedValue);
            
            if (diff < minDiff) {
                minDiff = diff;
                closestButton = button;
            }
        });
        
        // Add active class to closest button if the difference is small enough
        if (closestButton && minDiff <= 15) {
            closestButton.classList.add('active');
        }
    }
    
    generateArray() {
        const size = parseInt(this.sizeInput.value);
        const distribution = this.distributionSelect.value;
        
        this.array = [];
        
        switch (distribution) {
            case 'random':
                for (let i = 0; i < size; i++) {
                    this.array.push(Math.floor(Math.random() * 100) + 1);
                }
                break;
                
            case 'nearly-sorted':
                for (let i = 0; i < size; i++) {
                    this.array.push(i + 1);
                }
                // Swap a few elements to make it nearly sorted
                for (let i = 0; i < size / 10; i++) {
                    const idx1 = Math.floor(Math.random() * size);
                    const idx2 = Math.floor(Math.random() * size);
                    [this.array[idx1], this.array[idx2]] = [this.array[idx2], this.array[idx1]];
                }
                break;
                
            case 'reversed':
                for (let i = 0; i < size; i++) {
                    this.array.push(size - i);
                }
                break;
                
            case 'few-unique':
                for (let i = 0; i < size; i++) {
                    this.array.push(Math.floor(Math.random() * 5) + 1);
                }
                break;
        }
        
        // Save original array for reset
        this.originalArray = [...this.array];
        
        // Reset sorting state
        this.resetSortingState();
        
        // Render the array
        this.renderArray();
    }
    
    renderArray(actionIndices = [], actionType = null) {
        // Clear the visualization container
        this.visualizationContainer.innerHTML = '';
        
        // Get the maximum value for scaling
        const maxValue = Math.max(...this.array);
        
        // Create a bar for each element
        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            
            // Calculate height as percentage of container
            const heightPercent = (value / maxValue) * 100;
            bar.style.height = `${heightPercent}%`;
            
            // Set width based on array size
            const widthPercent = 100 / this.array.length;
            bar.style.width = `${widthPercent}%`;
            
            // Add class for special styling
            if (actionIndices.includes(index)) {
                if (actionType === 'swap') {
                    bar.classList.add('current');
                } else if (actionType === 'comparison') {
                    bar.classList.add('comparing');
                } else if (actionType === 'sorted') {
                    bar.classList.add('sorted');
                } else if (actionType === 'assignment') {
                    bar.classList.add('assignment');
                } else if (actionType === 'access') {
                    bar.classList.add('access');
                }
            }
            
            // Add value label if checkbox is checked
            if (this.showNumbersCheckbox.checked) {
                const valueLabel = document.createElement('div');
                valueLabel.className = 'bar-value';
                valueLabel.textContent = value;
                bar.appendChild(valueLabel);
            }
            
            this.visualizationContainer.appendChild(bar);
        });
    }
    
    updateAlgorithmInfo() {
        const algorithm = this.algorithmSelect.value;
        
        // Update complexity info
        const complexity = this.algorithms.getComplexity(algorithm);
        this.timeComplexity.textContent = `Time: ${complexity.time}`;
        this.spaceComplexity.textContent = `Space: ${complexity.space}`;
        
        // Update algorithm title and description
        this.algorithmTitle.textContent = `${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort`;
        this.algorithmDescription.textContent = this.algorithms.getDescription(algorithm);
        
        // Update code display
        this.updateAlgorithmCode();
    }
    
    updateStats() {
        const stats = this.algorithms.getStats();
        this.comparisonsDisplay.textContent = `Comparisons: ${stats.comparisons}`;
        this.swapsDisplay.textContent = `Swaps: ${stats.swaps}`;
        this.accessesDisplay.textContent = `Accesses: ${stats.accesses}`;
        this.memoryUsageDisplay.textContent = `Memory: ${stats.memoryUsage} units (Max: ${stats.maxMemoryUsage})`;
        
        // Update metrics data for charts
        this.updateMetricsData(stats);
    }
    
    updateMetricsData(stats) {
        // Add stats to metrics data arrays
        const stepIndex = this.currentActionIndex + 1;
        
        // Update data arrays
        this.metricsData.comparisons[stepIndex] = stats.comparisons;
        this.metricsData.swaps[stepIndex] = stats.swaps;
        this.metricsData.accesses[stepIndex] = stats.accesses;
        this.metricsData.memory[stepIndex] = stats.memoryUsage;
        
        // Update charts
        this.updateCharts();
    }
    
    initCharts() {
        try {
            // Check if Chart is available
            if (typeof Chart === 'undefined') {
                console.error('Chart.js is not loaded. Please check your network connection or include the script properly.');
                // Create a fallback display for metrics
                const metricsChartsContainer = document.querySelector('.metrics-charts');
                if (metricsChartsContainer) {
                    metricsChartsContainer.innerHTML = '<div class="chart-error">Charts could not be loaded. Please check console for details.</div>';
                }
                return;
            }
            
            // Set Chart.js global defaults for smooth animation
            Chart.defaults.animation = {
                duration: 200,
                easing: 'easeOutQuad'
            };
            
            // Operations chart with improved styling
            const operationsCtx = this.operationsChart.getContext('2d');
            this.operationsChartInstance = new Chart(operationsCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Comparisons',
                            data: [],
                            borderColor: '#3498db',
                            backgroundColor: 'rgba(52, 152, 219, 0.1)',
                            borderWidth: 2,
                            tension: 0.2,
                            fill: true,
                            pointRadius: 2,
                            pointHoverRadius: 5
                        },
                        {
                            label: 'Swaps',
                            data: [],
                            borderColor: '#e74c3c',
                            backgroundColor: 'rgba(231, 76, 60, 0.1)',
                            borderWidth: 2,
                            tension: 0.2,
                            fill: true,
                            pointRadius: 2,
                            pointHoverRadius: 5
                        },
                        {
                            label: 'Accesses',
                            data: [],
                            borderColor: '#f39c12',
                            backgroundColor: 'rgba(243, 156, 18, 0.1)',
                            borderWidth: 2,
                            tension: 0.2,
                            fill: true,
                            pointRadius: 2,
                            pointHoverRadius: 5
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Operations Over Time',
                            color: '#f0f0f0',
                            font: {
                                size: 16,
                                weight: 'bold'
                            },
                            padding: 10
                        },
                        legend: {
                            labels: {
                                color: '#f0f0f0',
                                usePointStyle: true,
                                boxWidth: 8,
                                padding: 15
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: {
                                weight: 'bold'
                            },
                            displayColors: true,
                            callbacks: {
                                title: (tooltipItems) => {
                                    return `Step: ${tooltipItems[0].label}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Steps',
                                color: '#f0f0f0',
                                font: {
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                color: '#f0f0f0',
                                maxRotation: 0,
                                autoSkip: true,
                                maxTicksLimit: 10
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Count',
                                color: '#f0f0f0',
                                font: {
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                color: '#f0f0f0'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    }
                }
            });
            
            // Memory chart with improved styling
            const memoryCtx = this.memoryChart.getContext('2d');
            this.memoryChartInstance = new Chart(memoryCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Memory Usage',
                            data: [],
                            borderColor: '#2ecc71',
                            backgroundColor: 'rgba(46, 204, 113, 0.2)',
                            borderWidth: 2,
                            tension: 0.2,
                            fill: true,
                            pointRadius: 2,
                            pointHoverRadius: 5
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Memory Usage Over Time',
                            color: '#f0f0f0',
                            font: {
                                size: 16,
                                weight: 'bold'
                            },
                            padding: 10
                        },
                        legend: {
                            labels: {
                                color: '#f0f0f0',
                                usePointStyle: true,
                                boxWidth: 8,
                                padding: 15
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: {
                                weight: 'bold'
                            },
                            callbacks: {
                                title: (tooltipItems) => {
                                    return `Step: ${tooltipItems[0].label}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Steps',
                                color: '#f0f0f0',
                                font: {
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                color: '#f0f0f0',
                                maxRotation: 0,
                                autoSkip: true,
                                maxTicksLimit: 10
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Units',
                                color: '#f0f0f0',
                                font: {
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                color: '#f0f0f0'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
            console.log('Charts initialized successfully');
        } catch (error) {
            console.error('Error initializing charts:', error);
            // Create a fallback display for metrics
            const metricsChartsContainer = document.querySelector('.metrics-charts');
            if (metricsChartsContainer) {
                metricsChartsContainer.innerHTML = `<div class="chart-error">Error initializing charts: ${error.message}</div>`;
            }
        }
    }
    
    updateCharts() {
        try {
            // If charts aren't initialized yet, exit
            if (!this.operationsChartInstance || !this.memoryChartInstance) {
                return;
            }
            
            // Create labels array for x-axis - only include up to current step
            const currentStep = this.currentActionIndex + 1;
            const labels = Array.from({ length: currentStep }, (_, i) => i);
            
            // Get relevant data slices
            const comparisonsData = this.metricsData.comparisons.slice(0, currentStep);
            const swapsData = this.metricsData.swaps.slice(0, currentStep);
            const accessesData = this.metricsData.accesses.slice(0, currentStep);
            const memoryData = this.metricsData.memory.slice(0, currentStep);
            
            // Update operations chart
            this.operationsChartInstance.data.labels = labels;
            this.operationsChartInstance.data.datasets[0].data = comparisonsData;
            this.operationsChartInstance.data.datasets[1].data = swapsData;
            this.operationsChartInstance.data.datasets[2].data = accessesData;
            
            // Update memory chart
            this.memoryChartInstance.data.labels = labels;
            this.memoryChartInstance.data.datasets[0].data = memoryData;
            
            // Update both charts
            this.operationsChartInstance.update();
            this.memoryChartInstance.update();
        } catch (error) {
            console.error('Error updating charts:', error);
        }
    }
    
    updateChartTheme() {
        try {
            // If charts aren't initialized yet, exit
            if (!this.operationsChartInstance || !this.memoryChartInstance) {
                return;
            }
            
            const isLightMode = document.body.classList.contains('light-mode');
            const textColor = isLightMode ? '#333333' : '#f0f0f0';
            const gridColor = isLightMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
            
            // Update operations chart
            this.operationsChartInstance.options.plugins.title.color = textColor;
            this.operationsChartInstance.options.plugins.legend.labels.color = textColor;
            this.operationsChartInstance.options.scales.x.title.color = textColor;
            this.operationsChartInstance.options.scales.x.ticks.color = textColor;
            this.operationsChartInstance.options.scales.x.grid.color = gridColor;
            this.operationsChartInstance.options.scales.y.title.color = textColor;
            this.operationsChartInstance.options.scales.y.ticks.color = textColor;
            this.operationsChartInstance.options.scales.y.grid.color = gridColor;
            this.operationsChartInstance.update();
            
            // Update memory chart
            this.memoryChartInstance.options.plugins.title.color = textColor;
            this.memoryChartInstance.options.plugins.legend.labels.color = textColor;
            this.memoryChartInstance.options.scales.x.title.color = textColor;
            this.memoryChartInstance.options.scales.x.ticks.color = textColor;
            this.memoryChartInstance.options.scales.x.grid.color = gridColor;
            this.memoryChartInstance.options.scales.y.title.color = textColor;
            this.memoryChartInstance.options.scales.y.ticks.color = textColor;
            this.memoryChartInstance.options.scales.y.grid.color = gridColor;
            this.memoryChartInstance.update();
        } catch (error) {
            console.error('Error updating chart theme:', error);
        }
    }
    
    runSortingAlgorithm() {
        const algorithm = this.algorithmSelect.value;
        const result = this.algorithms.runAlgorithm(algorithm, [...this.array]);
        
        // Don't update the array yet, just save the actions
        this.sortingActions = result.actions;
        
        // Initialize metrics data with empty arrays
        this.metricsData = {
            comparisons: new Array(this.sortingActions.length + 1).fill(0),
            swaps: new Array(this.sortingActions.length + 1).fill(0),
            accesses: new Array(this.sortingActions.length + 1).fill(0),
            memory: new Array(this.sortingActions.length + 1).fill(0)
        };
        
        // Set initial value
        this.metricsData.comparisons[0] = 0;
        this.metricsData.swaps[0] = 0;
        this.metricsData.accesses[0] = 0;
        this.metricsData.memory[0] = 0;
        
        // Update statistics
        this.updateStats();
        
        // Update charts with initial data
        this.updateCharts();
    }
    
    startSorting() {
        if (this.isCompleted) {
            this.resetSorting();
        }
        
        if (!this.isSorting) {
            // Run the algorithm if not already run
            if (this.sortingActions.length === 0) {
                this.runSortingAlgorithm();
            }
            
            this.isSorting = true;
            this.playButton.disabled = true;
            this.pauseButton.disabled = false;
            
            // Start the animation
            this.animateSorting();
        }
    }
    
    pauseSorting() {
        this.isSorting = false;
        this.playButton.disabled = false;
        this.pauseButton.disabled = true;
    }
    
    resetSorting() {
        // Reset to original state
        this.array = [...this.originalArray];
        this.resetSortingState();
        this.renderArray();
        
        // Reset metrics data
        if (this.sortingActions && this.sortingActions.length > 0) {
            this.metricsData = {
                comparisons: new Array(this.sortingActions.length + 1).fill(0),
                swaps: new Array(this.sortingActions.length + 1).fill(0),
                accesses: new Array(this.sortingActions.length + 1).fill(0),
                memory: new Array(this.sortingActions.length + 1).fill(0)
            };
        } else {
            this.metricsData = {
                comparisons: [0],
                swaps: [0],
                accesses: [0],
                memory: [0]
            };
        }
        
        // Update charts
        this.updateCharts();
    }
    
    resetSortingState() {
        this.sortingActions = [];
        this.currentActionIndex = -1;
        this.isSorting = false;
        this.isCompleted = false;
        this.playButton.disabled = false;
        this.pauseButton.disabled = true;
        
        // Reset stats
        this.algorithms.resetStats();
        this.updateStats();
    }
    
    stepForward() {
        if (this.sortingActions.length === 0) {
            this.runSortingAlgorithm();
        }
        
        if (this.currentActionIndex < this.sortingActions.length - 1) {
            this.currentActionIndex++;
            this.applyAction(this.sortingActions[this.currentActionIndex]);
            
            // If reached the end, mark as completed
            if (this.currentActionIndex === this.sortingActions.length - 1) {
                this.isCompleted = true;
                // Mark all bars as sorted
                this.renderArray(Array.from(Array(this.array.length).keys()), 'sorted');
            }
        }
    }
    
    animateSorting() {
        if (!this.isSorting) return;
        
        if (this.currentActionIndex < this.sortingActions.length - 1) {
            this.stepForward();
            
            // Schedule the next step
            setTimeout(() => {
                this.animateSorting();
            }, this.animationSpeed);
        } else {
            // Sorting is complete
            this.isSorting = false;
            this.isCompleted = true;
            this.playButton.disabled = false;
            this.pauseButton.disabled = true;
        }
    }
    
    applyAction(action) {
        // Apply action to the array
        if (action.type === 'swap') {
            const [i, j] = action.indices;
            [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
            
            // Highlight elements based on action type
            this.renderArray(action.indices, action.type);
            
            // Highlight related code
            this.highlightCodeLine('swap');
        } else if (action.type === 'assignment') {
            const [i] = action.indices;
            const [value] = action.values;
            this.array[i] = value;
            
            // Highlight elements based on action type
            this.renderArray(action.indices, action.type);
            
            // Highlight related code
            this.highlightCodeLine('assignment');
        } else if (action.type === 'comparison') {
            // Highlight elements for comparison
            this.renderArray(action.indices, action.type);
            
            // Highlight related code
            this.highlightCodeLine('comparison');
        } else if (action.type === 'memory') {
            // No visual change, just update stats
            
            // Highlight related code
            this.highlightCodeLine('memory', action.operation);
        } else if (action.type === 'access') {
            // Highlight accessed elements
            this.renderArray(action.indices, 'access');
            
            // Highlight related code
            this.highlightCodeLine('access');
        }
        
        // Display operation description
        this.displayOperationDescription(action);
        
        // Update stats
        this.updateStats();
    }
    
    displayOperationDescription(action) {
        let description = '';
        let pseudocode = '';
        
        // Use the action's description if available
        if (action.codeDescription) {
            description = action.codeDescription;
        } else {
            // Fallback descriptions based on action type
            switch (action.type) {
                case 'swap':
                    description = 'Swapping elements';
                    break;
                case 'assignment':
                    description = 'Assigning value to array element';
                    break;
                case 'comparison':
                    description = 'Comparing elements';
                    break;
                case 'access':
                    description = 'Accessing array element';
                    break;
                case 'memory':
                    description = action.operation === 'allocate' ? 'Allocating memory' : 'Releasing memory';
                    break;
                default:
                    description = 'Performing operation';
            }
        }
        
        // Use the action's pseudocode if available
        if (action.pseudocode) {
            pseudocode = action.pseudocode;
        } else {
            // Fallback pseudocode based on action type
            switch (action.type) {
                case 'swap':
                    const [i, j] = action.indices;
                    pseudocode = `swap(array[${i}], array[${j}])`;
                    break;
                case 'assignment':
                    const [index] = action.indices;
                    const [value] = action.values;
                    pseudocode = `array[${index}] = ${value}`;
                    break;
                case 'comparison':
                    const [a, b] = action.indices;
                    pseudocode = `if (array[${a}] > array[${b}])`;
                    break;
                case 'access':
                    const [idx] = action.indices;
                    pseudocode = `value = array[${idx}]`;
                    break;
                case 'memory':
                    pseudocode = action.operation === 'allocate' ? 'new Array(size)' : 'free(array)';
                    break;
                default:
                    pseudocode = '';
            }
        }
        
        // Update the operation description display
        this.operationDescription.innerHTML = `
            <div class="operation-type ${action.type}">${description}</div>
            <div class="operation-code">${pseudocode}</div>
        `;
        
        // Make it visible
        this.operationDescription.style.display = 'block';
    }
    
    updateAlgorithmCode() {
        const algorithm = this.algorithmSelect.value;
        const language = document.querySelector('input[name="code-language"]:checked').value;
        
        // Clear existing content first
        this.algorithmCode.innerHTML = '';
        
        // Create and append a pre element for proper code formatting
        const preElement = document.createElement('pre');
        preElement.className = language === 'javascript' ? 'language-javascript' : 'language-python';
        
        // Get the code for the selected algorithm
        const code = language === 'javascript' 
            ? this.getJavaScriptImplementation(algorithm) 
            : this.getPythonImplementation(algorithm);
            
        // Append the formatted code to the pre element
        preElement.appendChild(code);
        
        // Append the pre element to the code container
        this.algorithmCode.appendChild(preElement);
    }
    
    getJavaScriptImplementation(algorithm) {
        // Define the code for each algorithm
        const codeStrings = {
            bubble: `
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
}`,
            insertion: `
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
}`,
            selection: `
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
}`,
            merge: `
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
}`,
            quick: `
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
}`
        };
        
        // Format the code with proper syntax highlighting and line numbers
        return this.formatCode(codeStrings[algorithm] || '// Code not available for this algorithm');
    }
    
    getPythonImplementation(algorithm) {
        // Define the code for each algorithm
        const codeStrings = {
            bubble: `
# Bubble Sort
def bubble_sort(self):
    n = len(self.data)
    
    for i in range(n):
        swapped = False
        
        for j in range(0, n - i - 1):
            if self.compare(j, j + 1):
                self.swap(j, j + 1)
                swapped = True
                
        # If no swapping occurred in this pass, array is sorted
        if not swapped:
            break`,
            insertion: `
# Insertion Sort
def insertion_sort(self):
    n = len(self.data)
    
    for i in range(1, n):
        key = self.data[i]
        self.access(i)
        j = i - 1
        
        while j >= 0 and self.data[j] > key:
            self.access(j)
            self.assign(j + 1, self.data[j])
            j -= 1
            
        self.assign(j + 1, key)`,
            selection: `
# Selection Sort
def selection_sort(self):
    n = len(self.data)
    
    for i in range(n - 1):
        min_idx = i
        
        for j in range(i + 1, n):
            if self.compare(min_idx, j):
                min_idx = j
                
        if min_idx != i:
            self.swap(i, min_idx)`,
            merge: `
# Merge Sort
def merge_sort(self):
    def _merge_sort(arr, l, r):
        if l < r:
            m = l + (r - l) // 2
            
            # Sort first and second halves
            _merge_sort(arr, l, m)
            _merge_sort(arr, m + 1, r)
            
            # Merge the sorted halves
            merge(arr, l, m, r)
    
    def merge(arr, l, m, r):
        n1 = m - l + 1
        n2 = r - m
        
        # Create temp arrays
        L = [0] * n1
        R = [0] * n2
        
        # Copy data to temp arrays
        for i in range(n1):
            L[i] = self.data[l + i]
            self.access(l + i)
            
        for j in range(n2):
            R[j] = self.data[m + 1 + j]
            self.access(m + 1 + j)
            
        # Merge the temp arrays back
        i = 0       # Initial index of first subarray
        j = 0       # Initial index of second subarray
        k = l       # Initial index of merged subarray
        
        while i < n1 and j < n2:
            if L[i] <= R[j]:
                self.assign(k, L[i])
                i += 1
            else:
                self.assign(k, R[j])
                j += 1
            k += 1
            
        # Copy the remaining elements of L[]
        while i < n1:
            self.assign(k, L[i])
            i += 1
            k += 1
            
        # Copy the remaining elements of R[]
        while j < n2:
            self.assign(k, R[j])
            j += 1
            k += 1
    
    _merge_sort(self.data, 0, len(self.data) - 1)`,
            quick: `
# Quick Sort
def quick_sort(self):
    def _quick_sort(arr, low, high):
        if low < high:
            # pi is partitioning index
            pi = partition(arr, low, high)
            
            # Separately sort elements
            _quick_sort(arr, low, pi - 1)
            _quick_sort(arr, pi + 1, high)
    
    def partition(arr, low, high):
        # Pivot (Element to be placed at right position)
        pivot = self.data[high]
        self.access(high)
        
        i = low - 1  # Index of smaller element
        
        for j in range(low, high):
            # If current element is smaller than the pivot
            if self.data[j] <= pivot:
                self.access(j)
                i += 1
                self.swap(i, j)
                
        self.swap(i + 1, high)
        return i + 1
    
    _quick_sort(self.data, 0, len(self.data) - 1)`
        };
        
        // Format the code with proper syntax highlighting and line numbers
        return this.formatCode(codeStrings[algorithm] || '# Code not available for this algorithm');
    }
    
    formatCode(codeStr) {
        // Create a document fragment to build the code display
        const fragment = document.createDocumentFragment();
        
        // Strip leading whitespace to maintain proper indentation
        const lines = codeStr.trim().split('\n');
        
        // Process each line
        lines.forEach((line, index) => {
            // Create a line container
            const lineDiv = document.createElement('div');
            lineDiv.className = 'line';
            lineDiv.setAttribute('data-line', index + 1);
            
            // Create and append line number
            const lineNumber = document.createElement('span');
            lineNumber.className = 'line-number';
            lineNumber.textContent = index + 1;
            lineDiv.appendChild(lineNumber);
            
            // Create line content container
            const lineContent = document.createElement('span');
            lineContent.className = 'line-content';
            
            // Handle indentation
            const indentMatch = line.match(/^(\s*)/);
            const indentSize = indentMatch ? indentMatch[0].length : 0;
            if (indentSize > 0) {
                lineContent.style.paddingLeft = `${indentSize * 0.5}em`;
            }
            
            // Apply syntax highlighting by tokenizing and creating colored spans
            const tokens = this.tokenizeLine(line);
            tokens.forEach(token => {
                const span = document.createElement('span');
                span.className = token.type;
                span.textContent = token.text;
                lineContent.appendChild(span);
            });
            
            // Add line content to line div
            lineDiv.appendChild(lineContent);
            
            // Add the complete line to the fragment
            fragment.appendChild(lineDiv);
        });
        
        return fragment;
    }
    
    tokenizeLine(line) {
        // This function breaks a line into tokens for syntax highlighting
        const tokens = [];
        
        // Helper to add a token
        const addToken = (text, type) => {
            if (text) tokens.push({ text, type });
        };
        
        // Check for full line comments first
        const commentMatch = line.match(/^(\s*)((\/\/|#).*)$/);
        if (commentMatch) {
            if (commentMatch[1]) {
                addToken(commentMatch[1], 'plain');
            }
            addToken(commentMatch[2], 'comment');
            return tokens;
        }
        
        // Enhanced regex patterns for different token types
        const patterns = [
            // Comments
            { type: 'comment', regex: /^(\/\/.*|#.*)/ },
            
            // Keywords - language specific
            { 
                type: 'keyword', 
                regex: /^(const|let|var|for|if|while|function|return|break|continue|this|new|class|def|import|from|in|range|not|and|or|else|True|False|None|self)\b/ 
            },
            
            // Built-in functions and methods
            { 
                type: 'function', 
                regex: /^(len|print|range|map|filter|sorted|min|max|sum|abs|int|str|float|list|dict|set|tuple|any|all|enumerate)\b(?=\s*\()/ 
            },
            
            // Function calls
            { type: 'function', regex: /^([A-Za-z_][A-Za-z0-9_]*)\s*(?=\()/ },
            
            // Method calls (obj.method())
            { type: 'keyword', regex: /^(self)\b/ },
            { type: 'function', regex: /^(\.[A-Za-z_][A-Za-z0-9_]*)\s*(?=\()/ },
            
            // Strings with escape handling
            { type: 'string', regex: /^(["'])((?:\\.|[^\\])*?)\1/ },
            
            // Numbers including decimals
            { type: 'number', regex: /^[0-9]+(?:\.[0-9]+)?/ },
            
            // Operators and punctuation with grouping
            { type: 'operator', regex: /^(=>|<=|>=|==|!=|&&|\|\||[-+*/%=<>!&|^~?:;.,[\]{}()])/ }
        ];
        
        // Process the line character by character
        let remaining = line;
        while (remaining.length > 0) {
            let matched = false;
            
            // Try each pattern
            for (const pattern of patterns) {
                const match = remaining.match(pattern.regex);
                if (match) {
                    addToken(match[0], pattern.type);
                    remaining = remaining.substring(match[0].length);
                    matched = true;
                    break;
                }
            }
            
            // Special handling for method access (obj.method)
            const methodMatch = remaining.match(/^(\.[A-Za-z_][A-Za-z0-9_]*)/);
            if (!matched && methodMatch) {
                addToken(methodMatch[0], 'function');
                remaining = remaining.substring(methodMatch[0].length);
                matched = true;
            }
            
            // Special handling for property access (obj.property)
            const propertyMatch = remaining.match(/^([A-Za-z_][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*)/);
            if (!matched && propertyMatch) {
                const parts = propertyMatch[0].split('.');
                addToken(parts[0], 'variable');
                addToken('.', 'operator');
                addToken(parts[1], 'property');
                remaining = remaining.substring(propertyMatch[0].length);
                matched = true;
            }
            
            // If no pattern matched, consume one character as plain text
            if (!matched) {
                addToken(remaining[0], 'plain');
                remaining = remaining.substring(1);
            }
        }
        
        return tokens;
    }
    
    highlightCodeLine(actionType, operation = null) {
        // Remove active class from all lines
        document.querySelectorAll('.line').forEach(line => {
            line.classList.remove('active');
        });
        
        const algorithm = this.algorithmSelect.value;
        const language = document.querySelector('input[name="code-language"]:checked').value;
        
        // Map of keywords to look for based on action type
        const keywords = {
            swap: ['swap', 'this.swap'],
            comparison: ['compare', 'this.compare', 'if', 'while'],
            assignment: ['assign', 'this.assign', '='],
            access: ['access', 'this.access'],
            memory: {
                allocate: ['allocateMemory', 'new Array'],
                deallocate: ['deallocateMemory']
            }
        };
        
        let searchTerms = [];
        if (actionType === 'memory' && operation) {
            searchTerms = keywords[actionType][operation] || [];
        } else {
            searchTerms = keywords[actionType] || [];
        }
        
        // Find lines that contain the keywords
        const lines = document.querySelectorAll('.line');
        let highlightedLine = null;
        
        for (const line of lines) {
            const lineText = line.textContent.toLowerCase();
            
            for (const term of searchTerms) {
                if (lineText.includes(term.toLowerCase())) {
                    line.classList.add('active');
                    highlightedLine = line;
                    break;
                }
            }
            
            if (highlightedLine) break;
        }
        
        // If a line was highlighted, scroll to it
        if (highlightedLine) {
            const codeContainer = document.querySelector('.code-container');
            if (codeContainer) {
                codeContainer.scrollTop = highlightedLine.offsetTop - codeContainer.offsetHeight / 2;
            }
        }
    }
} 