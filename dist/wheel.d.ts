import { IroColorPickerOptions } from './colorPickerOptions';
import { IroColor } from './color';
export interface WheelProps extends IroColorPickerOptions {
    color: IroColor;
}
/**
 * @desc Get the point as the center of the wheel
 * @param props - wheel props
 */
export declare function getWheelDimensions(props: Partial<WheelProps>): {
    width: number;
    radius: number;
    cx: number;
    cy: number;
};
/**
 * @desc Translate an angle according to wheelAngle and wheelDirection
 * @param props - wheel props
 * @param angle - input angle
 */
export declare function translateWheelAngle(props: Partial<WheelProps>, angle: number, invert?: boolean): number;
/**
 * @desc Get the current handle position for a given color
 * @param props - wheel props
 * @param color
 */
export declare function getWheelHandlePosition(props: Partial<WheelProps>, color: IroColor): {
    x: number;
    y: number;
};
/**
 * @desc Get the current wheel value from user input
 * @param props - wheel props
 * @param x - global input x position
 * @param y - global input y position
 */
export declare function getWheelValueFromInput(props: Partial<WheelProps>, x: number, y: number): {
    h: number;
    s: number;
};
