import { describe, it, expect } from "vitest";
import { dataConverter } from "../core/algorithm";
import type { Rect, ConnectionPoint } from "../types/types";

describe("dataConverter basic test", () => {
    it("returns a line between two connection points", () => {
        const r1: Rect = { position: { x: 100, y: 100 }, size: { width: 80, height: 60 } };
        const r2: Rect = { position: { x: 300, y: 100 }, size: { width: 80, height: 60 } };

        const cp1: ConnectionPoint = { point: { x: 140, y: 100 }, angle: 0 };    // правая грань r1
        const cp2: ConnectionPoint = { point: { x: 260, y: 100 }, angle: 180 };  // левая грань r2

        const result = dataConverter(r1, r2, cp1, cp2);

        expect(result[0]).toEqual(cp1.point);
        expect(result[result.length - 1]).toEqual(cp2.point);
    });
});
