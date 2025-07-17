import React from "react";
import type { ConnectorSide } from "../types/types";

// Types for the props
interface ControlPanelProps {
    shapeMargin: number;
    showRectLines: boolean;
    showWeightedGraph: boolean;
    showShortestPath: boolean;
    showPathPoints: boolean;
    shapeAConnectorPosition: number;
    shapeBConnectorPosition: number;
    setShapeMargin: (v: number) => void;
    setShowRectLines: (v: boolean) => void;
    setShowWeightedGraph: (v: boolean) => void;
    setShowShortestPath: (v: boolean) => void;
    setShowPathPoints: (v: boolean) => void;
    setShapeAConnectorPosition: (v: number) => void;
    setShapeBConnectorPosition: (v: number) => void;
    shapeASize: { width: number; height: number };
    shapeBSize: { width: number; height: number };
    onShapeASizeChange: (size: { width?: number; height?: number }) => void;
    onShapeBSizeChange: (size: { width?: number; height?: number }) => void;
    shapeASide: ConnectorSide;
    shapeBSide: ConnectorSide;
    setShapeASide: (side: ConnectorSide) => void;
    setShapeBSide: (side: ConnectorSide) => void;
}

const ControlPanel = ({
    shapeMargin,
    showRectLines,
    showWeightedGraph,
    showShortestPath,
    shapeAConnectorPosition,
    shapeBConnectorPosition,
    shapeASize,
    shapeBSize,
    setShapeMargin,
    setShowRectLines,
    setShowWeightedGraph,
    setShowShortestPath,
    setShapeAConnectorPosition,
    setShapeBConnectorPosition,
    onShapeASizeChange,
    onShapeBSizeChange,
    shapeASide,
    shapeBSide,
    setShapeASide,
    setShapeBSide,

}: ControlPanelProps) => {
    return (
        <div
            style={{
                position: "fixed",
                right: 0,
                top: 0,
                width: 300,
                height: "100vh",
                backgroundColor: "#1e1e1e",
                color: "#f0f0f0",
                padding: "16px",
                fontFamily: "sans-serif",
                zIndex: 2,
                overflowY: "auto",
                boxShadow: "0 0 12px rgba(0,0,0,0.3)",
            }}
        >
            <Section title="Как использовать">
                <ul style={{ paddingLeft: 20 }}>
                    <li>Нажать на квадрат что бы перетаскивать мышкой</li>
                    <li>Менять точки</li>
                    <li> <a href="https://github.com/artemdev9/orthogonal-pathfinder-canvas-ts" target="_blank" rel="noopener noreferrer">GitHub репозиторий проекта</a> </li>
                </ul>
            </Section>

            <Divider />

            <Section title="Уровни алгоритма">
                <Checkbox
                    label="Линии Фигур"
                    checked={showRectLines}
                    onChange={(e) => setShowRectLines(e.target.checked)}
                />
                <Checkbox
                    label="График Растояний"
                    checked={showWeightedGraph}
                    onChange={(e) => setShowWeightedGraph(e.target.checked)}
                />
                <Checkbox
                    label="Короткий Путь"
                    checked={showShortestPath}
                    onChange={(e) => setShowShortestPath(e.target.checked)}
                />
            </Section>

            <Divider />

            <Section title="Настройки">
                <div style={{ marginBottom: 16 }}>
                    <label style={{ marginBottom: 16 }}>
                        Ширина:
                        <input
                            type="number"
                            min={10}
                            value={shapeASize.width}
                            onChange={e => onShapeASizeChange({ width: Number(e.target.value) })}
                            style={{ width: 60, marginLeft: 8 }}
                        />
                    </label>
                    <label style={{ marginLeft: 16 }}>
                        Высота:
                        <input
                            type="number"
                            min={10}
                            value={shapeASize.height}
                            onChange={e => onShapeASizeChange({ height: Number(e.target.value) })}
                            style={{ width: 60, marginLeft: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label style={{ marginBottom: 16 }}>
                        Ширина:
                        <input
                            type="number"
                            min={10}
                            value={shapeBSize.width}
                            onChange={e => onShapeBSizeChange({ width: Number(e.target.value) })}
                            style={{ width: 60, marginLeft: 8 }}
                        />
                    </label>
                    <label style={{ marginLeft: 16 }}>
                        Высота:
                        <input
                            type="number"
                            min={10}
                            value={shapeBSize.height}
                            onChange={e => onShapeBSizeChange({ height: Number(e.target.value) })}
                            style={{ width: 60, marginLeft: 8 }}
                        />
                    </label>
                </div>
                <Slider
                    label="Растояние Возле Края Фигур"
                    value={shapeMargin}
                    min={0}
                    max={50}
                    onChange={setShapeMargin}
                />
                <Slider
                    label="Позиция Конектора A"
                    value={shapeAConnectorPosition}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={setShapeAConnectorPosition}
                />
                <Slider
                    label="Позиция Конектора B"
                    value={shapeBConnectorPosition}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={setShapeBConnectorPosition}
                />
            </Section>

            <Divider />

            <Section title="Стороны конектора">
                <label>
                    Коннектор 1:
                    <select value={shapeASide} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setShapeASide(e.target.value as ConnectorSide)}>
                        <option value="top">Верх</option>
                        <option value="bottom">Низ</option>
                        <option value="left">Лево</option>
                        <option value="right">Право</option>
                    </select>
                </label>
                <br />
                <label>
                    Коннектор 2:
                    <select value={shapeBSide} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setShapeBSide(e.target.value as ConnectorSide)}>
                        <option value="top">Верх</option>
                        <option value="bottom">Низ</option>
                        <option value="left">Лево</option>
                        <option value="right">Право</option>
                    </select>
                </label>
            </Section>

            <Divider />

        </div>
    );
};

export default ControlPanel;

// --- UI Components

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 24 }}>
        <h4 style={{ margin: "0 0 8px" }}>{title}</h4>
        {children}
    </div>
);

const Divider = () => (
    <div
        style={{
            height: 1,
            backgroundColor: "#444",
            margin: "16px 0",
        }}
    />
);

const Checkbox = ({
    label,
    checked = false,
    onChange,
}: {
    label: string;
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
    <label style={{ display: "block", marginBottom: 8 }}>
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            style={{ marginRight: 8 }}
        />
        {label}
    </label>
);

const Slider = ({
    label,
    value,
    min,
    max,
    step = 1,
    onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (v: number) => void;
}) => (
    <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4 }}>
            {label}: {value}
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ width: "100%" }}
        />
    </div>
);
