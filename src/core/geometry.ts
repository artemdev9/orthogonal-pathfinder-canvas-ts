import type { Point, Rect } from "../types/types";

/**
 * Проверяет, лежит ли точка на грани прямоугольника (с учетом погрешности)
 */
export const isPointOnRectEdge = (point: Point, rect: Rect): boolean => {
    const left = rect.position.x - rect.size.width / 2;
    const right = rect.position.x + rect.size.width / 2;
    const top = rect.position.y - rect.size.height / 2;
    const bottom = rect.position.y + rect.size.height / 2;

    const tolerance = 0.01;

    const onVertical = (Math.abs(point.x - left) < tolerance || Math.abs(point.x - right) < tolerance)
        && point.y >= top && point.y <= bottom;

    const onHorizontal = (Math.abs(point.y - top) < tolerance || Math.abs(point.y - bottom) < tolerance)
        && point.x >= left && point.x <= right;

    return onVertical || onHorizontal;
};

/**
 * Проверяет, валиден ли угол подключения: он должен быть перпендикулярен стороне
 * и направлен наружу от центра прямоугольника.
 */
export const isValidConnectionAngle = (point: Point, angle: number, rect: Rect): boolean => {
    const cx = rect.position.x;
    const cy = rect.position.y;
    const w = rect.size.width;
    const h = rect.size.height;

    const left = cx - w / 2;
    const right = cx + w / 2;
    const top = cy - h / 2;
    const bottom = cy + h / 2;

    const tolerance = 0.01;

    // Правая грань
    if (Math.abs(point.x - right) < tolerance && point.y >= top && point.y <= bottom) {
        return angle === 0;
    }

    // Левая грань
    if (Math.abs(point.x - left) < tolerance && point.y >= top && point.y <= bottom) {
        return angle === 180;
    }

    // Верхняя грань
    if (Math.abs(point.y - top) < tolerance && point.x >= left && point.x <= right) {
        return angle === 270;
    }

    // Нижняя грань
    if (Math.abs(point.y - bottom) < tolerance && point.x >= left && point.x <= right) {
        return angle === 90;
    }

    return false;
};
