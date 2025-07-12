import type { Graph, Point } from "../types/types";

type PathNode = {
    point: Point;
    priority: number;
};

function pointKey(point: Point): string {
    return `${point.x}:${point.y}`;
}

export function dijkstraShortestPath(graph: Graph, start: Point, end: Point): Point[] {
    const startKey = pointKey(start);
    const endKey = pointKey(end);

    if (!graph.has(startKey) || !graph.has(endKey)) {
        console.warn("Start or end point does not exist in the graph.");
        return [];
    }

    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const visited = new Set<string>();

    const queue: PathNode[] = [];

    // Initialize
    for (const key of graph.keys()) {
        distances.set(key, Infinity);
        previous.set(key, null);
    }
    distances.set(startKey, 0);
    queue.push({ point: start, priority: 0 });

    while (queue.length > 0) {
        // Sort queue based on priority (distance)
        queue.sort((a, b) => a.priority - b.priority);
        const current = queue.shift()!;
        const currentKey = pointKey(current.point);

        if (visited.has(currentKey)) continue;
        visited.add(currentKey);

        if (currentKey === endKey) break;

        const node = graph.get(currentKey);
        if (!node) continue;

        for (const neighbor of node.neighbors) {
            const neighborKey = pointKey(neighbor.point);
            const altDistance = distances.get(currentKey)! + neighbor.weight;

            if (altDistance < distances.get(neighborKey)!) {
                distances.set(neighborKey, altDistance);
                previous.set(neighborKey, currentKey);
                queue.push({ point: neighbor.point, priority: altDistance });
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
