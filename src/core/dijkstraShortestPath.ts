import type { Graph, Point } from "../types/types";

type PathNode = {
    point: Point;
    priority: number;
    prevDirection: Direction | null;
};

type Direction = "up" | "down" | "left" | "right";

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
