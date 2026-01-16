import { useState, useEffect } from "react";
import CanvasBoard from "./components/CanvasBoard";
import ControlPanel from "./components/ControlPanel";
import { dataConverter } from "./core/algorithm";
import type { Rect, ConnectionPoint, Point, Graph, ConnectorSide } from "./types/types";

const safePosition = (pos: number): number => Math.max(0.01, Math.min(0.99, pos));

const getConnectionPoints = (
  rects: Rect[],
  shapeAConnectorPosition: number,
  shapeBConnectorPosition: number,
  shapeASide: ConnectorSide,
  shapeBSide: ConnectorSide
): [ConnectionPoint, ConnectionPoint] => {
  const computeConnector = (
    rect: Rect,
    side: ConnectorSide,
    position: number
  ): ConnectionPoint => {
    const { x, y } = rect.position;
    const { width, height } = rect.size;
    switch (side) {
      case "top":
        return {
          point: { x: x - width / 2 + width * safePosition(position), y: y - height / 2 },
          angle: 90,
        };
      case "bottom":
        return {
          point: { x: x - width / 2 + width * safePosition(position), y: y + height / 2 },
          angle: 270,
        };
      case "left":
        return {
          point: { x: x - width / 2, y: y - height / 2 + height * safePosition(position) },
          angle: 0,
        };
      case "right":
        return {
          point: { x: x + width / 2, y: y - height / 2 + height * safePosition(position) },
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
  const [showRectLines, setShowRectLines] = useState<boolean>(false);
  const [showPathPoints, setShowPathPoints] = useState<boolean>(false);
  const [showWeightedGraph, setShowWeightedGraph] = useState<boolean>(false);
  const [showShortestPath, setShowShortestPath] = useState<boolean>(true);

  const [shapeMargin, setShapeMargin] = useState<number>(10);
  const [shapeAConnectorPosition, setShapeAConnectorPosition] = useState<number>(0.5);
  const [shapeBConnectorPosition, setShapeBConnectorPosition] = useState<number>(0.5);
  const [shapeASide, setShapeASide] = useState<ConnectorSide>("top");
  const [shapeBSide, setShapeBSide] = useState<ConnectorSide>("bottom");

  const [shapeAWidth, setShapeAWidth] = useState<number>(100);
  const [shapeAHeight, setShapeAHeight] = useState<number>(100);
  const [shapeBWidth, setShapeBWidth] = useState<number>(100);
  const [shapeBHeight, setShapeBHeight] = useState<number>(100);

  const [rects, setRects] = useState<Rect[]>([
    { position: { x: 150, y: 200 }, size: { width: shapeAWidth, height: shapeAHeight } },
    { position: { x: 500, y: 500 }, size: { width: shapeBWidth, height: shapeBHeight } },
  ]);

  const connectionPoints = getConnectionPoints(
    rects,
    shapeAConnectorPosition,
    shapeBConnectorPosition,
    shapeASide,
    shapeBSide
  );

  const [pathPoints, setPathPoints] = useState<Point[]>([]);
  const [graph, setGraph] = useState<Graph>(new Map());
  const [horizontal, setHorizontal] = useState<number[]>();
  const [vertical, setVertical] = useState<number[]>();

  useEffect(() => {
    setRects([
      { ...rects[0], size: { width: shapeAWidth, height: shapeAHeight } },
      { ...rects[1], size: { width: shapeBWidth, height: shapeBHeight } },
    ]);
  }, [shapeAWidth, shapeAHeight, shapeBWidth, shapeBHeight]);

  useEffect(() => {
    try {
      const [cp1, cp2] = getConnectionPoints(
        rects,
        shapeAConnectorPosition,
        shapeBConnectorPosition,
        shapeASide,
        shapeBSide
      );

      const [rect1, rect2] = rects;

      const {
        path,
        graph,
        horizontal,
        vertical,
      } = dataConverter(rect1, rect2, cp1, cp2, shapeMargin);

      setGraph(graph);
      setHorizontal(horizontal);
      setVertical(vertical);
      setPathPoints(path);
    } catch (error: any) {
      console.error("Data conversion error:", error.message);
      alert(`Error: ${error.message}`);
      setPathPoints([]);
      setGraph(new Map());
      setHorizontal([]);
      setVertical([]);
    }
  }, [
    rects,
    shapeMargin,
    shapeAConnectorPosition,
    shapeBConnectorPosition,
    shapeASide,
    shapeBSide,
  ]);


  return (
    <>
      <CanvasBoard
        rects={rects}
        connectionPoints={connectionPoints}
        path={pathPoints}
        graph={graph}
        horizontalLines={horizontal ?? []}
        verticalLines={vertical ?? []}
        onRectsChange={setRects}
        showRectLines={showRectLines}
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
