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
    get hsv(): HsvColor;
    set hsv(newValue: HsvColor);
    get hsva(): HsvColor;
    set hsva(value: HsvColor);
    get hue(): number;
    set hue(value: number);
    get saturation(): number;
    set saturation(value: number);
    get value(): number;
    set value(value: number);
    get alpha(): number;
    set alpha(value: number);
    get kelvin(): number;
    set kelvin(value: number);
    get red(): number;
    set red(value: number);
    get green(): number;
    set green(value: number);
    get blue(): number;
    set blue(value: number);
    get rgb(): RgbColor;
    set rgb(value: RgbColor);
    get rgba(): RgbColor;
    set rgba(value: RgbColor);
    get hsl(): HslColor;
    set hsl(value: HslColor);
    get hsla(): HslColor;
    set hsla(value: HslColor);
    get rgbString(): string;
    set rgbString(value: string);
    get rgbaString(): string;
    set rgbaString(value: string);
    get hexString(): string;
    set hexString(value: string);
    get hex8String(): string;
    set hex8String(value: string);
    get hslString(): string;
    set hslString(value: string);
    get hslaString(): string;
    set hslaString(value: string);
}
