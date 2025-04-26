# Sorting Algorithm Visualizer

> An interactive web-based visualization tool for common sorting algorithms with real-time animation and comprehensive metrics tracking. Created by [Fenil Sonani](https://fenilsonani.com).

**Live Demo**: [sortvisualizer.fenilsonani.com](https://sortvisualizer.fenilsonani.com)

![Sorting Algorithm Visualizer](https://via.placeholder.com/800x400?text=Sorting+Algorithm+Visualizer)

## Project Overview

This project provides a modern, interactive interface for visualizing and understanding how different sorting algorithms work. It allows users to:

- See step-by-step execution of sorting algorithms in real-time
- Compare algorithm performance with comprehensive metrics
- Experiment with different array sizes and distributions
- Learn about algorithm implementations with provided code examples

Whether you're a computer science student learning about algorithms, a developer refreshing your knowledge, or an educator teaching sorting concepts, this tool offers an intuitive way to visualize sorting processes.

## Features

- 10 different sorting algorithms: Bubble, Insertion, Selection, Merge, Quick, Heap, Radix, Shell, Comb, and Cocktail sort
- Multiple visualization options including array bars with color highlighting
- Real-time statistics tracking (comparisons, swaps, array accesses)
- Interactive metrics charts showing performance over time
- Algorithm code implementation examples in JavaScript and Python
- User-friendly controls for algorithm selection and animation control
- Customizable array size and data distribution patterns
- Dark/light mode toggle for comfortable viewing

## Technical Implementation

- Pure HTML, CSS, and JavaScript without framework dependencies
- Chart.js for performance metrics visualization
- Responsive design that works across devices
- Modular code architecture:
  - `algorithms.js`: Contains all sorting algorithm implementations
  - `visualizer.js`: Handles the visualization and animation logic
  - `main.js`: Core application logic and event handling

## Installation

No installation required! This is a client-side web application.

```bash
# Clone the repository
git clone https://github.com/fenilsonani/sorting-algorithm-visualizer.git
cd sorting-algorithm-visualizer

# Open in your browser
open index.html
```

For the hosted version, simply visit [sortvisualizer.fenilsonani.com](https://sortvisualizer.fenilsonani.com).

## Usage

Just open `index.html` in your browser to start using the application.

### Controls

- **Generate New Array**: Create a new array with selected size and distribution
- **Play/Pause**: Start or pause the sorting animation
- **Step**: Move forward one step in the algorithm
- **Reset**: Reset the current array to its initial state

### Algorithm Selection

Choose from 10 sorting algorithms, each with:
- Time and space complexity information
- Algorithm description
- Implementation code in JavaScript and Python

### Customization Options

- **Array Size**: Adjust the number of elements (5-100)
- **Animation Speed**: Control visualization speed (Very Slow to Very Fast)
- **Data Distribution**:
  - Random: Completely random values
  - Nearly Sorted: Mostly sorted with few out-of-place elements
  - Reversed: Values in reverse order
  - Few Unique: Multiple duplicate values

### Display Options

- Show/hide element numbers
- Show/hide performance metrics
- Toggle dark/light mode

## Learning Resources

The application provides educational resources:
- Detailed algorithm descriptions
- Time and space complexity analysis
- Real implementation code
- Performance comparisons through metrics

## Future Enhancements

Planned future improvements:
- Additional sorting algorithms
- Algorithm comparison mode
- Custom input arrays
- More visualization styles
- Export of performance data

## Keywords

Sorting algorithms, visualization tool, algorithm comparison, bubble sort, quick sort, merge sort, educational tool, computer science learning, algorithm animation, JavaScript sorting, algorithm complexity, sorting performance

## License

[MIT License](LICENSE)

## About the Author

[Fenil Sonani](https://fenilsonani.com) is a developer focused on creating educational tools and web applications. Visit [fenilsonani.com](https://fenilsonani.com) to see more projects and get in touch.

## Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Chart.js for metrics visualization

---

© 2025 [Fenil Sonani](https://fenilsonani.com) | [sortvisualizer.fenilsonani.com](https://sortvisualizer.fenilsonani.com) 