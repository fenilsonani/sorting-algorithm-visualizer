/**
 * Main JavaScript for initializing the Sorting Visualizer
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verify Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded. Adding fallback script...');
        
        // Create and add Chart.js script as fallback
        const chartScript = document.createElement('script');
        chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
        chartScript.onload = initVisualizer;
        chartScript.onerror = () => {
            console.error('Failed to load Chart.js. Some features will be disabled.');
            document.querySelectorAll('.metrics-charts').forEach(container => {
                container.innerHTML = '<div class="chart-error">Charts could not be loaded. Please check your internet connection.</div>';
            });
            initVisualizer();
        };
        document.head.appendChild(chartScript);
    } else {
        // Chart.js is already loaded, proceed with initialization
        initVisualizer();
    }
    
    function initVisualizer() {
        // Create the visualizer instance
        const visualizer = new SortingVisualizer();
        
        // Check for user preferences
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.body.classList.add('light-mode');
            document.querySelector('#dark-mode').checked = false;
            if (visualizer.updateChartTheme) {
                visualizer.updateChartTheme();
            }
        }
        
        // Listen for system color scheme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            const isDarkMode = e.matches;
            document.body.classList.toggle('light-mode', !isDarkMode);
            document.querySelector('#dark-mode').checked = isDarkMode;
            if (visualizer.updateChartTheme) {
                visualizer.updateChartTheme();
            }
        });
        
        // Fix for FontAwesome
        const faScript = document.querySelector('script[src*="fontawesome"]');
        if (faScript) {
            faScript.onerror = () => {
                // Fallback for FontAwesome icons if loading fails
                document.querySelectorAll('.fa-play').forEach(el => el.textContent = '▶');
                document.querySelectorAll('.fa-pause').forEach(el => el.textContent = '⏸');
                document.querySelectorAll('.fa-step-forward').forEach(el => el.textContent = '⏭');
                document.querySelectorAll('.fa-undo').forEach(el => el.textContent = '↺');
                document.querySelectorAll('.fa-random').forEach(el => el.textContent = '🔀');
                document.querySelectorAll('.fa-chart-bar').forEach(el => el.textContent = '📊');
                document.querySelectorAll('.fa-chevron-up').forEach(el => el.textContent = '▲');
                document.querySelectorAll('.fa-chevron-down').forEach(el => el.textContent = '▼');
            };
        }
    }
}); 