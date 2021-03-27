import { IroColorValue } from './color';
export declare type LayoutDirection = 'vertical' | 'horizontal' | '';
export declare type WheelDirection = 'clockwise' | 'anticlockwise' | '';
export interface IroColorPickerOptions {
    width?: number;
    height?: number;
    color?: IroColorValue;
    colors?: IroColorValue[];
    padding?: number;
    layoutDirection?: LayoutDirection;
    borderColor?: string;
    borderWidth?: number;
    handleRadius?: number;
    activeHandleRadius?: number;
    handleSvg?: string;
    handleProps?: any;
    wheelLightness?: boolean;
    wheelAngle?: number;
    wheelDirection?: WheelDirection;
    sliderSize?: number;
    sliderMargin?: number;
    boxHeight?: number;
}
export declare const iroColorPickerOptionDefaults: IroColorPickerOptions;
