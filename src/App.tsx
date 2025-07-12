import { useState, useEffect } from "react";
import CanvasBoard from "./components/CanvasBoard";
import { dataConverter } from "./core/algorithm";
import type { Rect, ConnectionPoint, Point, Graph } from "./types/types";
import { dijkstraShortestPath } from "./core/dijkstraShortestPath";
import { buildGraph } from "./core/algorithm";

import { shiftConnectionOutward } from "./core/algorithm";

const getConnectionPoints = (rects: Rect[]): ConnectionPoint[] => {
  return [
    {
      // Правая грань первого
      point: {
        x: rects[0].position.x,
        y: rects[0].position.y + rects[0].size.height / 2,
      },
      angle: 90,
    },
    {
      // Левая грань второго
      point: {
        x: rects[1].position.x + rects[1].size.width / 2,
        y: rects[1].position.y,
      },
      angle: 0,
    },
  ];
};

function pointKey(point: Point): string {
  return `${point.x}:${point.y}`;
}

function App() {
  const [rects, setRects] = useState<Rect[]>([
    { position: { x: 150, y: 200 }, size: { width: 100, height: 100 } },
    { position: { x: 500, y: 500 }, size: { width: 100, height: 200 } },
  ]);

  const connectionPoints = getConnectionPoints(rects);

  // 💡 Create state to hold path points
  const [pathPoints, setPathPoints] = useState<Point[]>([]);
  const [graph, setGraph] = useState<Graph>(new Map());

  const [horizontal, setHorizontal] = useState();
  const [vertical, setVertical] = useState();


  // // 🔁 Recalculate path when inputs change
  // useEffect(() => {
  //   const [cp1, cp2] = connectionPoints;
  //   const [rect1, rect2] = rects;

  //   const { gridPoints, graph, horizontal, vertical } = dataConverter(rect1, rect2, cp1, cp2);
  //   console.log(graph)

  //   setPathPoints(gridPoints); // or actual path later
  //   setGraph(graph);

  //   setHorizontal(horizontal);
  //   setVertical(vertical);

  // }, [rects]);

  useEffect(() => {
    const [cp1, cp2] = connectionPoints;
    const [rect1, rect2] = rects;

    const { gridPoints, graph, horizontal, vertical } = dataConverter(rect1, rect2, cp1, cp2);

    setGraph(graph);
    setHorizontal(horizontal);
    setVertical(vertical);

    console.log('graph', graph)



    // Try finding the shortest path between shifted connection points

    const start = shiftConnectionOutward(rect1, cp1, 20);
    const end = shiftConnectionOutward(rect2, cp2, 20);

    if (graph.has(pointKey(start)) && graph.has(pointKey(end))) {
      const path = dijkstraShortestPath(graph, start, end);
      setPathPoints(path);
    } else {
      console.warn("Start or end point missing from graph:", start, end);
    }



  }, [rects]);


  return (
    <CanvasBoard
      rects={rects}
      connectionPoints={connectionPoints}
      path={pathPoints}
      graph={graph}
      horizontalLines={horizontal}
      verticalLines={vertical}
      onRectsChange={setRects}
    />
  );
}

export default App;
