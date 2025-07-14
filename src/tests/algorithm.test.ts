import {
    isPointOnRectEdge,
    isValidConnectionAngle,
    getHorizontalLines,
    getVerticalLines,
    getEnhancedGridPoints,
    dijkstraShortestPath,
    dataConverter
} from '../core/algorithm'

import type { Point, Rect, ConnectionPoint, Graph } from '../types/types';

describe('Validation Functions', () => {
    const rect: Rect = { position: { x: 100, y: 100 }, size: { width: 50, height: 50 } };

    test('Point on edge', () => {
        const point: Point = { x: 125, y: 100 }; // Right edge
        expect(isPointOnRectEdge(point, rect)).toBe(true);
    });

    test('Point not on edge', () => {
        const point: Point = { x: 100, y: 100 }; // Center
        expect(isPointOnRectEdge(point, rect)).toBe(false);
    });

    test('Correct angle on top edge', () => {
        const point: Point = { x: 100, y: 75 }; // Top edge
        expect(isValidConnectionAngle(point, 90, rect)).toBe(true);
    });

    test('Wrong angle on right edge', () => {
        const point: Point = { x: 125, y: 100 }; // Right edge
        expect(isValidConnectionAngle(point, 90, rect)).toBe(false);
    });
});

describe('Grid Line Functions', () => {
    const rects: Rect[] = [
        { position: { x: 100, y: 100 }, size: { width: 50, height: 50 } }
    ];
    const margin = 10;

    test('Get horizontal lines', () => {
        const lines = getHorizontalLines(rects, margin);
        expect(lines.length).toBe(2);
        expect(lines[0]).toBeCloseTo(65); // top
        expect(lines[1]).toBeCloseTo(135); // bottom
    });

    test('Get vertical lines', () => {
        const lines = getVerticalLines(rects, margin);
        expect(lines.length).toBe(2);
        expect(lines[0]).toBeCloseTo(65); // left
        expect(lines[1]).toBeCloseTo(135); // right
    });

    test('Enhanced grid point count', () => {
        const h = [65, 100, 135];
        const v = [65, 100, 135];
        const points = getEnhancedGridPoints(h, v);
        expect(points.length).toBe((v.length - 1) * (h.length - 1) * 9); // 2x2 cells * 9 points
    });
});

describe('Pathfinding: dijkstraShortestPath', () => {
    const a: Point = { x: 0, y: 0 };
    const b: Point = { x: 10, y: 0 };

    test('Finds simple 2-point path', () => {
        const graph: Graph = new Map();
        graph.set('0:0', { point: a, neighbors: [{ point: b, weight: 10 }] });
        graph.set('10:0', { point: b, neighbors: [] });

        const path = dijkstraShortestPath(graph, a, b);
        expect(path).toEqual([a, b]);
    });

    test('Returns empty path when disconnected', () => {
        const graph: Graph = new Map();
        graph.set('0:0', { point: a, neighbors: [] }); // no connection to b

        const path = dijkstraShortestPath(graph, a, b);
        expect(path).toEqual([]);
    });
});

describe('dataConverter Integration', () => {
    const rect1: Rect = { position: { x: 100, y: 100 }, size: { width: 50, height: 50 } };
    const rect2: Rect = { position: { x: 300, y: 100 }, size: { width: 50, height: 50 } };
    const validConn1: ConnectionPoint = { point: { x: 125, y: 100 }, angle: 180 };
    const validConn2: ConnectionPoint = { point: { x: 275, y: 100 }, angle: 0 };
    const invalidPoint: ConnectionPoint = { point: { x: 100, y: 100 }, angle: 90 };
    const invalidAngle: ConnectionPoint = { point: { x: 125, y: 100 }, angle: 90 };

    test('Returns graph and non-empty path for valid rects and connectors', () => {
        const { graph, path } = dataConverter(rect1, rect2, validConn1, validConn2, 10);
        expect(graph.size).toBeGreaterThan(0);
        expect(path.length).toBeGreaterThan(0);
    });

    test('Throws if connection point is not on edge', () => {
        expect(() => {
            dataConverter(rect1, rect2, invalidPoint, validConn2, 10);
        }).toThrow("Connection point 1 is not on the edge");
    });

    test('Throws if connection angle is invalid', () => {
        expect(() => {
            dataConverter(rect1, rect2, invalidAngle, validConn2, 10);
        }).toThrow("Connection angle 1 is not perpendicular or not facing outward");
    });
});
