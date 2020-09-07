export interface ColorChanges {
    h: boolean;
    s: boolean;
    v: boolean;
    a: boolean;
}
export interface HsvColor {
    h?: number;
    s?: number;
    v?: number;
    a?: number;
}
export interface RgbColor {
    r: number;
    g: number;
    b: number;
    a?: number;
}
export interface HslColor {
    h: number;
    s: number;
    l: number;
    a?: number;
}
export declare type IroColorValue = IroColor | HsvColor | RgbColor | HslColor | string;
export declare class IroColor {
    private $;
    private onChange;
    private initialValue;
    index: number;
    /**
      * @constructor Color object
      * @param value - initial color value
    */
    constructor(value?: IroColorValue, onChange?: Function);
    /**
      * @desc Set the Color from any valid value
      * @param value - new color value
    */
    set(value: IroColorValue): void;
    /**
      * @desc Shortcut to set a specific channel value
      * @param format - hsv | hsl | rgb
      * @param channel - individual channel to set, for example if model = hsl, chanel = h | s | l
      * @param value - new value for the channel
    */
    setChannel(format: string, channel: string, value: number): void;
    /**
     * @desc Reset color back to its initial value
     */
    reset(): void;
    /**
      * @desc make new Color instance with the same value as this one
    */
    clone(): IroColor;
    /**
     * @desc remove color onChange
     */
    unbind(): void;
    /**
      * @desc Convert hsv object to rgb
      * @param hsv - hsv color object
    */
    static hsvToRgb(hsv: HsvColor): RgbColor;
    /**
      * @desc Convert rgb object to hsv
      * @param rgb - rgb object
    */
    static rgbToHsv(rgb: RgbColor): HsvColor;
    /**
      * @desc Convert hsv object to hsl
      * @param hsv - hsv object
    */
    static hsvToHsl(hsv: HsvColor): HslColor;
    /**
      * @desc Convert hsl object to hsv
      * @param hsl - hsl object
    */
    static hslToHsv(hsl: HslColor): HsvColor;
    /**
      * @desc Convert a kelvin temperature to an approx, RGB value
      * @param kelvin - kelvin temperature
    */
    static kelvinToRgb(kelvin: number): RgbColor;
    /**
     * @desc Convert an RGB color to an approximate kelvin temperature
     * @param kelvin - kelvin temperature
   */
    static rgbToKelvin(rgb: RgbColor): number;
    hsv: HsvColor;
    hsva: HsvColor;
    hue: number;
    saturation: number;
    value: number;
    alpha: number;
    kelvin: number;
    red: number;
    green: number;
    blue: number;
    rgb: RgbColor;
    rgba: RgbColor;
    hsl: HslColor;
    hsla: HslColor;
    rgbString: string;
    rgbaString: string;
    hexString: string;
    hex8String: string;
    hslString: string;
    hslaString: string;
}
