import { IroColorPickerOptions } from './colorPickerOptions';
import { IroColor } from './color';
export interface WheelProps extends IroColorPickerOptions {
    color: IroColor;
}
/**
 * @desc Translate an angle according to wheelAngle and wheelDirection
 * @param props - wheel props
 * @param angle - input angle
 */
export declare function translateWheelAngle(props: Partial<WheelProps>, angle: number): number;
/**
 * @desc Get the point as the center of the wheel
 * @param props - wheel props
 */
export declare function getWheelCenter(props: Partial<WheelProps>): {
    x: number;
    y: number;
};
/**
 * @desc Get the current handle position
 * @param props - wheel props
 */
export declare function getWheelHandlePosition(props: Partial<WheelProps>): {
    x: number;
    y: number;
};
/**
 * @desc Get the current wheel value from user input
 * @param props - wheel props
 * @param x - global input x position
 * @param y - global input y position
 * @param bounds - wheel element bounding box
 */
export declare function getWheelValueFromInput(props: Partial<WheelProps>, x: number, y: number, bounds: any): {
    h: number;
    s: number;
};
