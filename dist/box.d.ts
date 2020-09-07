import { IroColor } from './color';
import { IroColorPickerOptions } from './colorPickerOptions';
export interface BoxOptions extends IroColorPickerOptions {
    color: IroColor;
}
/**
 * @desc Get the CSS styles for the box root element
 * @param props - box props
 */
export declare function getBoxStyles(props: Partial<BoxOptions>): {
    [x: string]: number;
};
/**
 * @desc Get the bounding dimensions of the box
 * @param props - box props
 */
export declare function getBoxDimensions(props: Partial<BoxOptions>): {
    width: number;
    height: number;
    radius: number;
};
/**
 * @desc Get the current box value from user input
 * @param props - box props
 * @param x - global input x position
 * @param y - global input y position
 */
export declare function getBoxValueFromInput(props: Partial<BoxOptions>, x: number, y: number): {
    s: number;
    v: number;
};
/**
 * @desc Get the current box handle position for a given color
 * @param props - box props
 * @param color
 */
export declare function getBoxHandlePosition(props: Partial<BoxOptions>, color: IroColor): {
    x: number;
    y: number;
};
/**
 * @desc Get the gradient stops for a box
 * @param props - box props
 * @param color
 */
export declare function getBoxGradients(props: Partial<BoxOptions>, color: IroColor): (string | number)[][][];
