import { useState, useEffect, useMemo } from "react";
import CanvasBoard from "./components/CanvasBoard";
import ControlPanel from "./components/ControlPanel";
import { dataConverter } from "./core/algorithm";
import type { Rect, ConnectionPoint, Point, Graph } from "./types/types";

const getConnectionPoints = (
  rects: Rect[],
  shapeAConnectorPosition: number,
  shapeBConnectorPosition: number,
  shapeASide: "top" | "bottom" | "left" | "right",
  shapeBSide: "top" | "bottom" | "left" | "right"
): ConnectionPoint[] => {
  const computeConnector = (
    rect: Rect,
    side: "top" | "bottom" | "left" | "right",
    position: number
  ): ConnectionPoint => {
    const { x, y } = rect.position;
    const { width, height } = rect.size;

    switch (side) {
      case "top":
        return {
          point: { x: x - width / 2 + width * position, y: y - height / 2 },
          angle: 90,
        };
      case "bottom":
        return {
          point: { x: x - width / 2 + width * position, y: y + height / 2 },
          angle: 270,
        };
      case "left":
        return {
          point: { x: x - width / 2, y: y - height / 2 + height * position },
          angle: 0,
        };
      case "right":
        return {
          point: { x: x + width / 2, y: y - height / 2 + height * position },
          angle: 180,
        };
    }
  };

  return [
    computeConnector(rects[0], shapeASide, shapeAConnectorPosition),
    computeConnector(rects[1], shapeBSide, shapeBConnectorPosition),
  ];
};


function App() {
  // Visual toggles
  const [showRectLines, setShowRectLines] = useState(false);
  const [showPathPoints, setShowPathPoints] = useState(false);
  const [showWeightedGraph, setShowWeightedGraph] = useState(false);
  const [showShortestPath, setShowShortestPath] = useState(true);

  // Shape margin & connector positions
  const [shapeMargin, setShapeMargin] = useState(10);
  const [shapeAConnectorPosition, setShapeAConnectorPosition] = useState(0.5);
  const [shapeBConnectorPosition, setShapeBConnectorPosition] = useState(0.5);
  const [shapeASide, setShapeASide] = useState<"top" | "bottom" | "left" | "right">("top");
  const [shapeBSide, setShapeBSide] = useState<"top" | "bottom" | "left" | "right">("bottom");


  // Shape A & B size (split)
  const [shapeAWidth, setShapeAWidth] = useState(100);
  const [shapeAHeight, setShapeAHeight] = useState(100);
  const [shapeBWidth, setShapeBWidth] = useState(100);
  const [shapeBHeight, setShapeBHeight] = useState(100);

  // Rectangles
  const [rects, setRects] = useState<Rect[]>([
    { position: { x: 150, y: 200 }, size: { width: shapeAWidth, height: shapeAHeight } },
    { position: { x: 500, y: 500 }, size: { width: shapeBWidth, height: shapeBHeight } },
  ]);

  // Connection logic
  const connectionPoints = useMemo(
    () =>
      getConnectionPoints(
        rects,
        shapeAConnectorPosition,
        shapeBConnectorPosition,
        shapeASide,
        shapeBSide
      ),
    [rects, shapeAConnectorPosition, shapeBConnectorPosition, shapeASide, shapeBSide]
  );

  const [pathPoints, setPathPoints] = useState<Point[]>([]);
  const [graph, setGraph] = useState<Graph>(new Map());
  const [horizontal, setHorizontal] = useState<number[]>();
  const [vertical, setVertical] = useState<number[]>();

  // Sync rect size with dimension changes
  useEffect(() => {
    setRects([
      { ...rects[0], size: { width: shapeAWidth, height: shapeAHeight } },
      { ...rects[1], size: { width: shapeBWidth, height: shapeBHeight } },
    ]);
  }, [shapeAWidth, shapeAHeight, shapeBWidth, shapeBHeight]);

  useEffect(() => {
    const [cp1, cp2] = connectionPoints;
    const [rect1, rect2] = rects;

    const { gridPoints, graph, horizontal, vertical, path } = dataConverter(
      rect1, rect2, cp1, cp2, shapeMargin
    );

    setGraph(graph);
    setHorizontal(horizontal);
    setVertical(vertical);
    setPathPoints(path);
  }, [rects, shapeMargin]);

  return (
    <>
      <CanvasBoard
        rects={rects}
        connectionPoints={connectionPoints}
        path={pathPoints}
        graph={graph}
        horizontalLines={horizontal}
        verticalLines={vertical}
        onRectsChange={setRects}
        showRectLines={showRectLines}
        pathPoints={pathPoints}
        showPathPoints={showPathPoints}
        showWeightedGraph={showWeightedGraph}
        showShortestPath={showShortestPath}
      />
      <ControlPanel
        shapeMargin={shapeMargin}
        setShapeMargin={setShapeMargin}
        showRectLines={showRectLines}
        setShowRectLines={setShowRectLines}
        showPathPoints={showPathPoints}
        setShowPathPoints={setShowPathPoints}
        showWeightedGraph={showWeightedGraph}
        setShowWeightedGraph={setShowWeightedGraph}
        showShortestPath={showShortestPath}
        setShowShortestPath={setShowShortestPath}
        shapeAConnectorPosition={shapeAConnectorPosition}
        shapeBConnectorPosition={shapeBConnectorPosition}
        setShapeAConnectorPosition={setShapeAConnectorPosition}
        setShapeBConnectorPosition={setShapeBConnectorPosition}
        shapeASize={{ width: shapeAWidth, height: shapeAHeight }}
        shapeBSize={{ width: shapeBWidth, height: shapeBHeight }}
        onShapeASizeChange={({ width, height }) => {
          if (width !== undefined) setShapeAWidth(width);
          if (height !== undefined) setShapeAHeight(height);
        }}
        onShapeBSizeChange={({ width, height }) => {
          if (width !== undefined) setShapeBWidth(width);
          if (height !== undefined) setShapeBHeight(height);
        }}
        shapeASide={shapeASide}
        shapeBSide={shapeBSide}
        setShapeASide={setShapeASide}
        setShapeBSide={setShapeBSide}
      />
    </>
  );
}

export default App;
