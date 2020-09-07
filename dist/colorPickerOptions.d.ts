import { IroColorValue } from './color';
export declare type LayoutDirection = 'vertical' | 'horizontal' | '';
export declare type WheelDirection = 'clockwise' | 'anticlockwise' | '';
export interface IroColorPickerOptions {
    width?: number;
    height?: number;
    handleRadius?: number;
    handleSvg?: string;
    handleProps?: any;
    color?: IroColorValue;
    colors?: IroColorValue[];
    borderColor?: string;
    borderWidth?: number;
    wheelLightness?: boolean;
    wheelAngle?: number;
    wheelDirection?: WheelDirection;
    layoutDirection?: LayoutDirection;
    sliderSize?: number;
    sliderMargin?: number;
    padding?: number;
}
export declare const iroColorPickerOptionDefaults: IroColorPickerOptions;
