import { useEffect, useRef, useState } from "react";
import type { Point, Rect } from "../types/types";
import type { ConnectionPoint, Graph } from "../types/types";

type Props = {
    rects: Rect[];
    connectionPoints: ConnectionPoint[];
    onRectsChange: (updatedRects: Rect[]) => void;
    path: Point[];
    graph: Graph;
    horizontalLines: number[];
    verticalLines: number[];
    showRectLines: boolean;
    showWeightedGraph: boolean;
    showShortestPath: boolean;
};

// showPathPoints={showPathPoints}
// showWeightedGraph={showWeightedGraph}
// showShortestPath={showShortestPath}

const CanvasBoard = ({ rects, connectionPoints, path, graph, horizontalLines, verticalLines, onRectsChange, showRectLines, showWeightedGraph, showShortestPath }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const offsetRef = useRef<Point>({ x: 0, y: 0 });
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#66aaff";
        rects.forEach((rect) => {
            const { x, y } = rect.position;
            const { width, height } = rect.size;
            ctx.fillRect(x - width / 2, y - height / 2, width, height);
        });

        ctx.fillStyle = "#b1f4e3";
        connectionPoints.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.point.x, p.point.y, 7, 0, Math.PI * 2);
            ctx.fill();
        });

        if (showRectLines) {
            if (horizontalLines) {
                ctx.strokeStyle = "#e0e0e0";
                ctx.lineWidth = 1;
                horizontalLines.forEach(y => {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                });
            }
            if (verticalLines) {
                ctx.strokeStyle = "#e0e0e0";
                ctx.lineWidth = 1;
                verticalLines.forEach(x => {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                });
            }
        }

        if (showWeightedGraph) {
            if (graph) {
                ctx.strokeStyle = "gray";
                ctx.lineWidth = 1;
                ctx.font = "12px Arial";
                ctx.fillStyle = "white"; // 👈 make sure the text is visible on dark background

                for (const { point, neighbors } of graph.values()) {
                    neighbors.forEach(({ point: neighbor, weight }) => {
                        // 🟠 draw edge
                        ctx.beginPath();
                        ctx.moveTo(point.x, point.y);
                        ctx.lineTo(neighbor.x, neighbor.y);
                        ctx.stroke();

                        // 🏷 draw weight
                        const midX = (point.x + neighbor.x) / 2;
                        const midY = (point.y + neighbor.y) / 2;
                        ctx.fillText(weight.toFixed(0), midX + 4, midY - 4);
                    });

                    // 🔶 draw point (already visible)
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
                    ctx.fillStyle = "orange";
                    ctx.fill();
                }
            }
        }

        if (showShortestPath) {
            if (path.length > 1) {
                ctx.strokeStyle = "red";
                ctx.lineWidth = 3;
                ctx.beginPath();

                ctx.moveTo(connectionPoints[0].point.x, connectionPoints[0].point.y);
                ctx.lineTo(path[0].x, path[0].y);

                for (let i = 1; i < path.length; i++) {
                    ctx.lineTo(path[i].x, path[i].y);
                }

                ctx.lineTo(connectionPoints[1].point.x, connectionPoints[1].point.y);
                ctx.stroke();
            } else {
                // ❗ Draw warning text
                ctx.fillStyle = "yellow";
                ctx.font = "bold 20px Arial";
                ctx.fillText("⚠️ No shortest path available", 40, 40);
            }
        }

    }, [rects, connectionPoints, path, graph, horizontalLines, verticalLines, canvasSize]);

    //  helper functions rect dragging 
    function isRectHit(rect: Rect, point: Point): boolean {
        const left = rect.position.x - rect.size.width / 2;
        const right = rect.position.x + rect.size.width / 2;
        const top = rect.position.y - rect.size.height / 2;
        const bottom = rect.position.y + rect.size.height / 2;
        return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
    }

    function startDraggingRect(index: number, mousePos: Point) {
        setDragIndex(index);
        offsetRef.current = {
            x: mousePos.x - rects[index].position.x,
            y: mousePos.y - rects[index].position.y,
        };
    }

    function moveDraggedRect(mousePos: Point) {
        if (dragIndex === null) return;
        const newRects = [...rects];
        newRects[dragIndex] = {
            ...newRects[dragIndex],
            position: {
                x: mousePos.x - offsetRef.current.x,
                y: mousePos.y - offsetRef.current.y,
            },
        };
        onRectsChange(newRects);
    }

    function stopDraggingRect() {
        setDragIndex(null);
    }

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getMousePos(e);

        // need to check what was pressed and then call the function responsible for that 

        rects.forEach((rect, i) => {
            if (isRectHit(rect, pos)) {
                startDraggingRect(i, pos);
            }
        });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        moveDraggedRect(getMousePos(e));
    };

    const handleMouseUp = () => {
        stopDraggingRect();
    };

    return (
        <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                border: "1px solid #ccc",
                display: "block",
                zIndex: 1,
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
        />
    );
};

export default CanvasBoard;
