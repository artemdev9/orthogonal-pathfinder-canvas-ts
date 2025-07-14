export type Point = { x: number; y: number };
export type Size = { width: number; height: number };
export type Rect = { position: Point; size: Size };
export type ConnectionPoint = { point: Point; angle: number };
export type Graph = Map<string, { point: Point; neighbors: { point: Point; weight: number }[] }>;
export type PathNode = { point: Point; priority: number; prevDirection: Direction | null; };
export type Direction = "up" | "down" | "left" | "right";
export type ConnectorSide = "top" | "bottom" | "left" | "right";
