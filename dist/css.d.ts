import { IroColorPickerOptions } from './colorPickerOptions';
export declare function cssBorderStyles(props: IroColorPickerOptions): {
    boxSizing: string;
    border: string;
};
export declare type CssGradientType = 'linear' | 'radial' | 'conical';
export declare type CssGradientStops = [number, number | string][];
export declare function cssGradient(type: CssGradientType, direction: string, stops: CssGradientStops): string;
export declare function cssValue(value: number | string): string;
