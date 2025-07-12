import type { Point, Rect, ConnectionPoint } from "../types/types";

function getHorizontalLines(rects: Rect[], connections: ConnectionPoint[], margin = 20): number[] {
    const lines = new Set<number>();

    rects.forEach(rect => {
        const top = rect.position.y - rect.size.height / 2 - margin;
        const bottom = rect.position.y + rect.size.height / 2 + margin;
        lines.add(top);
        lines.add(bottom);
    });

    console.log('Lines from getHorizontalLines:', Array.from(lines).sort((a, b) => a - b));

    // connections.forEach(conn => {
    //     lines.add(conn.point.y);
    // });

    return Array.from(lines).sort((a, b) => a - b);
}

function getVerticalLines(rects: Rect[], connections: ConnectionPoint[], margin = 20): number[] {
    const lines = new Set<number>();

    rects.forEach(rect => {
        const left = rect.position.x - rect.size.width / 2 - margin;
        const right = rect.position.x + rect.size.width / 2 + margin;
        lines.add(left);
        lines.add(right);
    });

    // connections.forEach(conn => {
    //     lines.add(conn.point.x);
    // });

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



function printGrid(
    grid: Map<number, Map<number, Point>>,
    xCoords: number[],
    yCoords: number[]
) {
    console.log('\nGrid visualization:\n');

    for (const y of yCoords) {
        let row = '';
        for (const x of xCoords) {
            row += grid.get(y)?.has(x) ? '● ' : '· ';
        }
        console.log(row);
    }

    console.log('\nLegend: ● = point, · = empty\n');
}

function getEnhancedGridPoints(horizontal: number[], vertical: number[]): Point[] {
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

export function shiftConnectionOutward(rect: Rect, conn: ConnectionPoint, margin: number): Point {
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

type Graph = Map<string, { point: Point; neighbors: { point: Point; weight: number }[] }>;

function pointKey(p: Point): string {
    return `${p.x}:${p.y}`;
}

function distance(a: Point, b: Point): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Манхэттенское
}

export function buildGraph(points: Point[]): Graph {
    const graph: Graph = new Map();

    const pointMap = new Map<string, Point>();
    for (const p of points) {
        pointMap.set(pointKey(p), p);
    }

    for (const a of points) {
        const neighbors: { point: Point; weight: number }[] = [];

        for (const b of points) {
            const isHorizontal = a.y === b.y && a.x !== b.x;
            const isVertical = a.x === b.x && a.y !== b.y;

            if ((isHorizontal || isVertical) && distance(a, b) <= 2000) {
                neighbors.push({
                    point: b,
                    weight: distance(a, b)
                });
            }
        }

        graph.set(pointKey(a), { point: a, neighbors });
    }

    return graph;
}

export const dataConverter = (
    rect1: Rect,
    rect2: Rect,
    cPoint1: ConnectionPoint,
    cPoint2: ConnectionPoint
): { gridPoints: Point[]; graph: Graph } => {
    const rects = [rect1, rect2];
    const connections = [cPoint1, cPoint2];

    const margin = 20;

    let horizontal = getHorizontalLines(rects, connections, margin);
    let vertical = getVerticalLines(rects, connections, margin);

    const { minX, maxX, minY, maxY } = getBoundingBox(rects, margin);
    const boundingVerticals = [minX, maxX];
    const boundingHorizontals = [minY, maxY];

    console.log('Bounding box:', { minX, maxX, minY, maxY });
    console.log('Bounding verticals:', boundingVerticals);
    console.log('Bounding horizontals:', boundingHorizontals);

    vertical.push(...boundingVerticals);
    horizontal.push(...boundingHorizontals);

    connections.forEach((conn, i) => {
        const rect = rects[i];
        const side = getConnectionDirection(rect, conn);
        console.log(`Connection ${i} direction:`, side);
        if (!side) return;

        if (side === "left" || side === "right") {
            // Horizontal connection → horizontal line at Y
            horizontal.push(conn.point.y);
            console.log(`Added horizontal line for connection ${i}:`, conn.point.y);
        } else if (side === "top" || side === "bottom") {
            // Vertical connection → vertical line at X
            vertical.push(conn.point.x);
            console.log(`Added vertical line for connection ${i}:`, conn.point.x);
        }
    });

    horizontal = Array.from(new Set(horizontal)).sort((a, b) => a - b);
    vertical = Array.from(new Set(vertical)).sort((a, b) => a - b);

    console.log('Final horizontal lines:', horizontal);
    console.log('Final vertical lines:', vertical);

    let gridPoints = getEnhancedGridPoints(horizontal, vertical);
    console.log('Grid points before filtering:', gridPoints);
    // let gridPoints = getGridPoints(horizontal, vertical);

    gridPoints = gridPoints.filter(point => {
        const isOnBoundingLine =
            boundingHorizontals.includes(point.y) ||
            boundingVerticals.includes(point.x);

        if (isOnBoundingLine) return true;

        return !rects.some(rect => isPointInsideRectWithMargin(point, rect, margin));
    });

    console.log('Grid points after filtering:', gridPoints);

    for (let i = 0; i < connections.length; i++) {
        const conn = connections[i];
        const rect = rects[i];

        const shifted = shiftConnectionOutward(rect, conn, margin);
        console.log(`Shifted connection point ${i}:`, shifted);

        const alreadyExists = gridPoints.some(p => p.x === shifted.x && p.y === shifted.y);
        if (!alreadyExists) {
            gridPoints.push(shifted);
            console.log(`Added shifted connection point ${i} to gridPoints.`);
        }
    }

    gridPoints = Array.from(
        new Map(gridPoints.map(p => [pointKey(p), p])).values()
    );

    // const graph = buildGraph(gridPoints);

    console.log('Final grid points: ', gridPoints);
    // console.log('Graph structure:', graph);


    const grid2D = new Map<number, Map<number, Point>>();

    for (const p of gridPoints) {
        if (!grid2D.has(p.y)) grid2D.set(p.y, new Map());
        grid2D.get(p.y)!.set(p.x, p);
    }


    const xCoords = Array.from(new Set(gridPoints.map(p => p.x))).sort((a, b) => a - b);
    const yCoords = Array.from(new Set(gridPoints.map(p => p.y))).sort((a, b) => a - b);

    printGrid(grid2D, xCoords, yCoords);

    const graph = buildStructuredGraph(gridPoints, grid2D, xCoords, yCoords);



    return { gridPoints, graph, horizontal, vertical };
};
