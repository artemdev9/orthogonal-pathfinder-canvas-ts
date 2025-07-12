import { useState, useEffect } from "react";
import CanvasBoard from "./components/CanvasBoard";
import { dataConverter } from "./core/algorithm";
import type { Rect, ConnectionPoint, Point, Graph } from "./types/types";
import { buildGraph } from "./core/algorithm";

const getConnectionPoints = (rects: Rect[]): ConnectionPoint[] => {
  return [
    {
      // Правая грань первого
      point: {
        x: rects[0].position.x + rects[0].size.width / 2,
        y: rects[0].position.y,
      },
      angle: 0,
    },
    {
      // Левая грань второго
      point: {
        x: rects[1].position.x,
        y: rects[1].position.y + rects[1].size.height / 2,
      },
      angle: 90,
    },
  ];
};


function App() {
  const [rects, setRects] = useState<Rect[]>([
    { position: { x: 150, y: 200 }, size: { width: 100, height: 100 } },
    { position: { x: 500, y: 500 }, size: { width: 100, height: 200 } },
  ]);

  const connectionPoints = getConnectionPoints(rects);

  // 💡 Create state to hold path points
  const [pathPoints, setPathPoints] = useState<Point[]>([]);
  const [graph, setGraph] = useState<Graph>(new Map());


  // 🔁 Recalculate path when inputs change
  useEffect(() => {
    const [cp1, cp2] = connectionPoints;
    const [rect1, rect2] = rects;

    const { gridPoints, graph } = dataConverter(rect1, rect2, cp1, cp2);
    console.log(graph)

    setPathPoints(gridPoints); // or actual path later
    setGraph(graph);

  }, [rects]);

  return (
    <CanvasBoard
      rects={rects}
      connectionPoints={connectionPoints}
      path={pathPoints}
      graph={graph}
      onRectsChange={setRects}
    />
  );
}

export default App;
