# Orthogonal Pathfinder Canvas

**TypeScript + React** interactive visualization tool for finding and displaying the shortest orthogonal path between two rectangles with customizable connection points and intelligent obstacle avoidance.

## 🚀 Features

- **Interactive Canvas**: Drag and drop rectangles with real-time path recalculation
- **Advanced Pathfinding**: Implements Dijkstra's algorithm with Manhattan distance and turn penalties
- **Dynamic Grid System**: Automatic grid generation with enhanced connection points
- **Customizable Connections**: Adjustable connector positions, sides, and shape margins
- **Visualization Modes**: Toggle between path, graph, and boundary displays
- **Responsive Design**: Full-screen canvas with adaptive sizing
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions

## 🛠️ Technical Implementation

### Core Algorithm
- **Pathfinding**: Modified Dijkstra's algorithm with orthogonal movement constraints
- **Grid Generation**: Enhanced grid system with 9-point cell structure for optimal pathfinding
- **Distance Calculation**: Manhattan distance with turn penalty optimization
- **Collision Detection**: Rectangle boundary checking with configurable margins

### Architecture
- **Component-Based**: Modular React components with separation of concerns
- **State Management**: React hooks for efficient state updates and side effects
- **Canvas Rendering**: HTML5 Canvas with optimized drawing operations
- **Type System**: Comprehensive TypeScript interfaces for all data structures

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/artemdev9/orthogonal-pathfinder-canvas-ts.git

# Navigate to project directory
cd orthogonal-pathfinder-canvas-ts

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

## 🎯 How to Use

1. **Drag Rectangles**: Click and drag any rectangle to reposition it
2. **Adjust Connections**: Use the control panel to modify connector positions and sides
3. **Configure Settings**: Change shape dimensions, margins, and visualization options
4. **Toggle Visualizations**: Enable/disable grid lines, weighted graph, and shortest path display

## 🧮 Algorithm Details

### Grid Generation
The algorithm creates an enhanced grid system where each cell contains 9 connection points:
- Corner points (NW, NE, SE, SW)
- Edge midpoints (N, E, S, W)
- Center point (C)

### Pathfinding Process
1. **Grid Construction**: Generate valid points avoiding rectangle interiors
2. **Graph Building**: Create weighted edges between adjacent grid points
3. **Path Calculation**: Apply Dijkstra's algorithm with turn penalties
4. **Path Optimization**: Minimize both distance and direction changes

### Distance Metrics
- **Base Distance**: Manhattan distance between points
- **Turn Penalty**: Additional cost for direction changes (default: 5)
- **Edge Weights**: Calculated dynamically based on grid structure

## 🏗️ Project Structure

```
src/
├── components/
│   ├── CanvasBoard.tsx     # Main canvas rendering and interaction
│   └── ControlPanel.tsx    # UI controls and settings
├── core/
│   └── algorithm.ts        # Pathfinding and grid algorithms
├── types/
│   └── types.ts           # TypeScript type definitions
├── App.tsx                # Main application component
└── main.tsx              # Application entry point
```

## 🎨 Technologies Used

- **React 19**: Modern React with latest features
- **TypeScript**: Type-safe development experience
- **Vite**: Fast build tool and development server
- **HTML5 Canvas**: High-performance graphics rendering
- **Vitest**: Modern testing framework

## 💡 Key Demonstrated Skills

### Frontend Development
- **React Expertise**: Hooks, state management, component architecture
- **TypeScript Mastery**: Complex type systems, interfaces, and generics
- **Canvas API**: Advanced graphics programming and interaction handling
- **Algorithm Implementation**: Graph theory, pathfinding, and optimization

### Problem Solving
- **Computational Geometry**: Rectangle collision detection and boundary calculations
- **Graph Theory**: Dijkstra's algorithm implementation with custom weights
- **Performance Optimization**: Efficient rendering and state updates
- **User Experience**: Intuitive controls and real-time feedback

### Code Quality
- **Clean Architecture**: Modular design with clear separation of concerns
- **Type Safety**: Comprehensive TypeScript coverage
- **Error Handling**: Robust error management and user feedback
- **Testing Ready**: Structured for easy unit and integration testing

## 🔧 Configuration Options

- **Shape Margin**: Distance offset from rectangle edges (0-50px)
- **Connector Position**: Position along rectangle edge (0.0-1.0)
- **Connector Sides**: Top, bottom, left, or right connections
- **Visualization Toggles**: Grid lines, weighted graph, shortest path

## 🚀 Performance Features

- **Real-time Updates**: Instant path recalculation on shape movement
- **Optimized Rendering**: Efficient canvas drawing with minimal redraws
- **Memory Management**: Proper cleanup and resource management
- **Responsive Design**: Adaptive canvas sizing for different screen sizes

---

**Developed by Artem Dumchev**  
*Frontend Developer specializing in React, TypeScript, and algorithmic visualization*

📧 [dumchevartem@gmail.com](mailto:dumchevartem@gmail.com)  
🔗 [LinkedIn](https://linkedin.com/in/artdumchev)  
🐙 [GitHub](https://github.com/artemdev9)
