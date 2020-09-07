import { IroColor } from './color';
import { IroColorPickerOptions } from './colorPickerOptions';
export declare type SliderShape = 'bar' | 'circle' | '';
export declare type SliderType = 'red' | 'green' | 'blue' | 'alpha' | 'hue' | 'saturation' | 'value' | 'kelvin' | '';
export interface SliderOptions extends IroColorPickerOptions {
    color: IroColor;
    sliderShape: SliderShape;
    sliderType: SliderType;
    minTemperature: number;
    maxTemperature: number;
}
export declare const sliderDefaultOptions: {
    sliderShape: string;
    sliderType: string;
    minTemperature: number;
    maxTemperature: number;
};
/**
 * @desc Get the CSS styles for the slider root
 * @param props - slider props
 */
export declare function getSliderStyles(props: Partial<SliderOptions>): {
    [x: string]: number;
};
/**
 * @desc Get the bounding dimensions of the slider
 * @param props - slider props
 */
export declare function getSliderDimensions(props: Partial<SliderOptions>): {
    handleStart: number;
    handleRange: number;
    width: number;
    height: number;
    cx: number;
    cy: number;
    radius: number;
    x?: undefined;
    y?: undefined;
} | {
    handleStart: number;
    handleRange: number;
    radius: number;
    x: number;
    y: number;
    width: number;
    height: number;
    cx?: undefined;
    cy?: undefined;
};
/**
 * @desc Get the current slider value for a given color, as a percentage
 * @param props - slider props
 * @param color
 */
export declare function getCurrentSliderValue(props: Partial<SliderOptions>, color: IroColor): number;
/**
 * @desc Get the current slider value from user input
 * @param props - slider props
 * @param x - global input x position
 * @param y - global input y position
 */
export declare function getSliderValueFromInput(props: Partial<SliderOptions>, x: number, y: number): number;
/**
 * @desc Get the current handle position for a given color
 * @param props - slider props
 * @param color
 */
export declare function getSliderHandlePosition(props: Partial<SliderOptions>, color: IroColor): {
    x: number;
    y: number;
};
/**
 * @desc Get the gradient stops for a slider
 * @param props - slider props
 * @param color
 */
export declare function getSliderGradient(props: Partial<SliderOptions>, color: IroColor): any[];
/**
 * @desc Get the gradient coords for a slider
 * @param props - slider props
 */
export declare function getSliderGradientCoords(props: Partial<SliderOptions>): {
    x1: string;
    y1: string;
    x2: string;
    y2: string;
};
