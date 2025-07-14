import type { Point, Rect, ConnectionPoint, Graph, PathNode, Direction } from "../types/types";

export function getHorizontalLines(rects: Rect[], margin: number): number[] {
    const lines = new Set<number>();

    rects.forEach(rect => {
        const top = rect.position.y - rect.size.height / 2 - margin;
        const bottom = rect.position.y + rect.size.height / 2 + margin;
        lines.add(top);
        lines.add(bottom);
    });


    return Array.from(lines).sort((a, b) => a - b);
}

export function getVerticalLines(rects: Rect[], margin: number): number[] {
    const lines = new Set<number>();

    rects.forEach(rect => {
        const left = rect.position.x - rect.size.width / 2 - margin;
        const right = rect.position.x + rect.size.width / 2 + margin;
        lines.add(left);
        lines.add(right);
    });

    return Array.from(lines).sort((a, b) => a - b);
}

function isPointInsideRectWithMargin(point: Point, rect: Rect, margin: number): boolean {
    const left = rect.position.x - rect.size.width / 2 - margin;
    const right = rect.position.x + rect.size.width / 2 + margin;
    const top = rect.position.y - rect.size.height / 2 - margin;
    const bottom = rect.position.y + rect.size.height / 2 + margin;

    return (
        point.x >= left &&
        point.x <= right &&
        point.y >= top &&
        point.y <= bottom
    );
}

function getBoundingBox(rects: Rect[], margin: number) {
    const xs = rects.flatMap(rect => [
        rect.position.x - rect.size.width / 2 - margin,
        rect.position.x + rect.size.width / 2 + margin,
    ]);

    const ys = rects.flatMap(rect => [
        rect.position.y - rect.size.height / 2 - margin,
        rect.position.y + rect.size.height / 2 + margin,
    ]);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return { minX, maxX, minY, maxY };
}

export function isPointOnRectEdge(point: Point, rect: Rect): boolean {
    const { x, y } = rect.position;
    const { width, height } = rect.size;

    const left = x - width / 2;
    const right = x + width / 2;
    const top = y - height / 2;
    const bottom = y + height / 2;

    const tolerance = 0.5;

    const onLeftOrRight =
        (Math.abs(point.x - left) < tolerance || Math.abs(point.x - right) < tolerance) &&
        point.y >= top - tolerance && point.y <= bottom + tolerance;

    const onTopOrBottom =
        (Math.abs(point.y - top) < tolerance || Math.abs(point.y - bottom) < tolerance) &&
        point.x >= left - tolerance && point.x <= right + tolerance;

    return onLeftOrRight || onTopOrBottom;
}

export function isValidConnectionAngle(point: Point, angle: number, rect: Rect): boolean {
    const { x, y } = rect.position;
    const { width, height } = rect.size;

    const left = x - width / 2;
    const right = x + width / 2;
    const top = y - height / 2;
    const bottom = y + height / 2;

    const tolerance = 0.5;

    // Top edge ➡️ angle should be 90 (pointing up)
    if (Math.abs(point.y - top) < tolerance && point.x >= left - tolerance && point.x <= right + tolerance) {
        return angle === 90;
    }

    // Bottom edge ➡️ angle should be 270 (pointing down)
    if (Math.abs(point.y - bottom) < tolerance && point.x >= left - tolerance && point.x <= right + tolerance) {
        return angle === 270;
    }

    // Left edge ➡️ angle should be 0 (pointing left)
    if (Math.abs(point.x - left) < tolerance && point.y >= top - tolerance && point.y <= bottom + tolerance) {
        return angle === 0;
    }

    // Right edge ➡️ angle should be 180 (pointing right)
    if (Math.abs(point.x - right) < tolerance && point.y >= top - tolerance && point.y <= bottom + tolerance) {
        return angle === 180;
    }

    return false;
}

function buildStructuredGraph(
    gridPoints: Point[],
    grid2D: Map<number, Map<number, Point>>,
    xCoords: number[],
    yCoords: number[]
): Graph {
    const graph: Graph = new Map();

    for (const p of gridPoints) {
        const neighbors: { point: Point; weight: number }[] = [];

        const xIndex = xCoords.indexOf(p.x);
        const yIndex = yCoords.indexOf(p.y);

        // Scan LEFT
        for (let i = xIndex - 1; i >= 0; i--) {
            const x = xCoords[i];
            const exists = grid2D.get(p.y)?.get(x);
            if (!exists) break; // there's a gap
            if (i === xIndex - 1) {
                neighbors.push({ point: exists, weight: distance(p, exists) });
                break;
            }
        }

        // Scan RIGHT
        for (let i = xIndex + 1; i < xCoords.length; i++) {
            const x = xCoords[i];
            const exists = grid2D.get(p.y)?.get(x);
            if (!exists) break;
            if (i === xIndex + 1) {
                neighbors.push({ point: exists, weight: distance(p, exists) });
                break;
            }
        }

        // Scan UP
        for (let i = yIndex - 1; i >= 0; i--) {
            const y = yCoords[i];
            const exists = grid2D.get(y)?.get(p.x);
            if (!exists) break;
            if (i === yIndex - 1) {
                neighbors.push({ point: exists, weight: distance(p, exists) });
                break;
            }
        }

        // Scan DOWN
        for (let i = yIndex + 1; i < yCoords.length; i++) {
            const y = yCoords[i];
            const exists = grid2D.get(y)?.get(p.x);
            if (!exists) break;
            if (i === yIndex + 1) {
                neighbors.push({ point: exists, weight: distance(p, exists) });
                break;
            }
        }

        graph.set(pointKey(p), { point: p, neighbors });
    }

    return graph;
}

export function getEnhancedGridPoints(horizontal: number[], vertical: number[]): Point[] {
    const points: Point[] = [];

    for (let yi = 0; yi < horizontal.length - 1; yi++) {
        const y1 = horizontal[yi];
        const y2 = horizontal[yi + 1];
        const cy = (y1 + y2) / 2;

        for (let xi = 0; xi < vertical.length - 1; xi++) {
            const x1 = vertical[xi];
            const x2 = vertical[xi + 1];
            const cx = (x1 + x2) / 2;

            // Add corners
            points.push({ x: x1, y: y1 }); // NW
            points.push({ x: x2, y: y1 }); // NE
            points.push({ x: x2, y: y2 }); // SE
            points.push({ x: x1, y: y2 }); // SW

            // Add edges
            points.push({ x: cx, y: y1 }); // N
            points.push({ x: x2, y: cy }); // E
            points.push({ x: cx, y: y2 }); // S
            points.push({ x: x1, y: cy }); // W

            // Add center
            points.push({ x: cx, y: cy }); // C
        }
    }

    return points;
}

function getConnectionDirection(rect: Rect, conn: ConnectionPoint): "left" | "right" | "top" | "bottom" | null {
    const { x, y } = rect.position;
    const { width, height } = rect.size;
    const halfW = width / 2;
    const halfH = height / 2;

    const px = conn.point.x;
    const py = conn.point.y;

    const eps = 0.1;

    if (Math.abs(px - (x - halfW)) < eps) return "left";
    if (Math.abs(px - (x + halfW)) < eps) return "right";
    if (Math.abs(py - (y - halfH)) < eps) return "top";
    if (Math.abs(py - (y + halfH)) < eps) return "bottom";

    return null;
}

function shiftConnectionOutward(rect: Rect, conn: ConnectionPoint, margin: number): Point {
    const side = getConnectionDirection(rect, conn);
    if (!side) return conn.point;

    const { x, y } = conn.point;

    switch (side) {
        case "left": return { x: x - margin, y };
        case "right": return { x: x + margin, y };
        case "top": return { x, y: y - margin };
        case "bottom": return { x, y: y + margin };
        default: return conn.point;
    }
}

function distance(a: Point, b: Point): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Манхэттенское
}

function pointKey(point: Point): string {
    return `${point.x}:${point.y}`;
}

function getDirection(from: Point, to: Point): Direction | null {
    if (from.x === to.x) {
        return from.y > to.y ? "up" : "down";
    }
    if (from.y === to.y) {
        return from.x > to.x ? "left" : "right";
    }
    return null; // diagonal or same point
}

export function dijkstraShortestPath(graph: Graph, start: Point, end: Point): Point[] {
    const startKey = pointKey(start);
    const endKey = pointKey(end);
    const turnPenalty = 5; // Increase to penalize turns more strongly

    if (!graph.has(startKey) || !graph.has(endKey)) {
        console.warn("Start or end point does not exist in the graph.");
        return [];
    }

    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const directions = new Map<string, Direction | null>();
    const visited = new Set<string>();
    const queue: PathNode[] = [];

    for (const key of graph.keys()) {
        distances.set(key, Infinity);
        previous.set(key, null);
        directions.set(key, null);
    }

    distances.set(startKey, 0);
    queue.push({ point: start, priority: 0, prevDirection: null });

    while (queue.length > 0) {
        queue.sort((a, b) => a.priority - b.priority);
        const current = queue.shift()!;
        const currentKey = pointKey(current.point);
        const currentDirection = current.prevDirection;

        if (visited.has(currentKey)) continue;
        visited.add(currentKey);

        if (currentKey === endKey) break;

        const node = graph.get(currentKey);
        if (!node) continue;

        for (const neighbor of node.neighbors) {
            const neighborKey = pointKey(neighbor.point);
            const moveDirection = getDirection(current.point, neighbor.point);
            if (!moveDirection) continue;

            const turnCost = currentDirection && moveDirection !== currentDirection ? turnPenalty : 0;
            const altDistance = distances.get(currentKey)! + neighbor.weight + turnCost;

            if (altDistance < distances.get(neighborKey)!) {
                distances.set(neighborKey, altDistance);
                previous.set(neighborKey, currentKey);
                directions.set(neighborKey, moveDirection);
                queue.push({
                    point: neighbor.point,
                    priority: altDistance,
                    prevDirection: moveDirection,
                });
            }
        }
    }

    // Reconstruct path
    const path: Point[] = [];
    let currentKey: string | null = endKey;

    while (currentKey) {
        const node = graph.get(currentKey);
        if (!node) break;
        path.unshift(node.point);
        currentKey = previous.get(currentKey) || null;
    }

    if (path.length === 0 || pointKey(path[0]) !== startKey) {
        console.warn("No path found");
        return [];
    }

    return path;
}


export const dataConverter = (
    rect1: Rect,
    rect2: Rect,
    cPoint1: ConnectionPoint,
    cPoint2: ConnectionPoint,
    shapeMargin: number
): { gridPoints: Point[]; graph: Graph; horizontal: number[]; vertical: number[]; path: Point[] } => {


    const rects = [rect1, rect2];
    const connections = [cPoint1, cPoint2];

    connections.forEach((conn, i) => {
        const rect = rects[i];
        if (!isPointOnRectEdge(conn.point, rect)) {
            throw new Error(`Connection point ${i + 1} is not on the edge of rectangle ${i + 1}`);
        }
        if (!isValidConnectionAngle(conn.point, conn.angle, rect)) {
            throw new Error(`Connection angle ${i + 1} is not perpendicular or not facing outward for rectangle ${i + 1}`);
        }
    });


    const margin = shapeMargin;

    let horizontal = getHorizontalLines(rects, margin);
    let vertical = getVerticalLines(rects, margin);

    const { minX, maxX, minY, maxY } = getBoundingBox(rects, margin);
    const boundingVerticals = [minX, maxX];
    const boundingHorizontals = [minY, maxY];



    vertical.push(...boundingVerticals);
    horizontal.push(...boundingHorizontals);

    connections.forEach((conn, i) => {
        const rect = rects[i];
        const side = getConnectionDirection(rect, conn);
        if (!side) return;

        if (side === "left" || side === "right") {
            horizontal.push(conn.point.y);
        } else if (side === "top" || side === "bottom") {
            vertical.push(conn.point.x);
        }
    });

    horizontal = Array.from(new Set(horizontal)).sort((a, b) => a - b);
    vertical = Array.from(new Set(vertical)).sort((a, b) => a - b);


    let gridPoints = getEnhancedGridPoints(horizontal, vertical);

    gridPoints = gridPoints.filter(point => {
        const isOnBoundingLine =
            boundingHorizontals.includes(point.y) ||
            boundingVerticals.includes(point.x);

        if (isOnBoundingLine) return true;

        return !rects.some(rect => isPointInsideRectWithMargin(point, rect, margin));
    });


    for (let i = 0; i < connections.length; i++) {
        const conn = connections[i];
        const rect = rects[i];

        const shifted = shiftConnectionOutward(rect, conn, margin);

        const alreadyExists = gridPoints.some(p => p.x === shifted.x && p.y === shifted.y);
        if (!alreadyExists) {
            gridPoints.push(shifted);
        }
    }

    gridPoints = Array.from(
        new Map(gridPoints.map(p => [pointKey(p), p])).values()
    );




    const grid2D = new Map<number, Map<number, Point>>();

    for (const p of gridPoints) {
        if (!grid2D.has(p.y)) grid2D.set(p.y, new Map());
        grid2D.get(p.y)!.set(p.x, p);
    }


    const xCoords = Array.from(new Set(gridPoints.map(p => p.x))).sort((a, b) => a - b);
    const yCoords = Array.from(new Set(gridPoints.map(p => p.y))).sort((a, b) => a - b);


    const graph = buildStructuredGraph(gridPoints, grid2D, xCoords, yCoords);

    const start = shiftConnectionOutward(rect1, cPoint1, margin);
    const end = shiftConnectionOutward(rect2, cPoint2, margin);
    let path;

    if (graph.has(pointKey(start)) && graph.has(pointKey(end))) {
        path = dijkstraShortestPath(graph, start, end);
    } else {
        console.warn("Start or end point missing from graph:", start, end);
    }

    return { gridPoints, graph, horizontal, vertical, path: path ?? [] };
};
