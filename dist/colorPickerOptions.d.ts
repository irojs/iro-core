import { IroColorValue } from './color';
export interface IroHandleOrigin {
    x: number;
    y: number;
}
export interface IroColorPickerOptions {
    width?: number;
    height?: number;
    handleRadius?: number;
    handleSvg?: string;
    handleOrigin?: IroHandleOrigin;
    color?: IroColorValue;
    borderColor?: string;
    borderWidth?: number;
    wheelLightness?: boolean;
    wheelAngle?: number;
    wheelDirection?: string;
    sliderHeight?: number;
    sliderMargin?: number;
    padding?: number;
}
export declare const iroColorPickerOptionDefaults: IroColorPickerOptions;
