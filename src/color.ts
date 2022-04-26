// Some regular expressions for rgb() and hsl() Colors are borrowed from tinyColor
// https://github.com/bgrins/TinyColor
// Kelvin temperature math borrowed from Neil Barlett's implementation
// from https://github.com/neilbartlett/color-temperature

// https://www.w3.org/TR/css3-values/#integers
const CSS_INTEGER = '[-\\+]?\\d+%?';
// http://www.w3.org/TR/css3-values/#number-value
const CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
// Allow positive/negative integer/number. Don't capture the either/or, just the entire outcome
const CSS_UNIT = '(?:' + CSS_NUMBER + ')|(?:' + CSS_INTEGER + ')';

// Parse function params
// Parens and commas are optional, and this also allows for whitespace between numbers
const PERMISSIVE_MATCH_3 = '[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?';
const PERMISSIVE_MATCH_4 = '[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?';

// Regex patterns for functional color strings
const REGEX_FUNCTIONAL_RGB = new RegExp('rgb' + PERMISSIVE_MATCH_3);
const REGEX_FUNCTIONAL_RGBA = new RegExp('rgba' + PERMISSIVE_MATCH_4);
const REGEX_FUNCTIONAL_HSL = new RegExp('hsl' + PERMISSIVE_MATCH_3);
const REGEX_FUNCTIONAL_HSLA = new RegExp('hsla' + PERMISSIVE_MATCH_4);

// Color string parsing regex
const HEX_START = '^(?:#?|0x?)';
const HEX_INT_SINGLE = '([0-9a-fA-F]{1})';
const HEX_INT_DOUBLE = '([0-9a-fA-F]{2})';
const REGEX_HEX_3 = new RegExp(HEX_START + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + '$');
const REGEX_HEX_4 = new RegExp(HEX_START + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + '$');
const REGEX_HEX_6 = new RegExp(HEX_START + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + '$');
const REGEX_HEX_8 = new RegExp(HEX_START + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + '$');

// Kelvin temperature bounds
const KELVIN_MIN = 2000;
const KELVIN_MAX = 40000;

// Math shorthands
const { log, round, floor } = Math;

/**
 * @desc Clamp a number between a min and max value
 * @param num - input value
 * @param min - min allowed value
 * @param max - max allowed value
 */
function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

/**
 * @desc Parse a css unit string - either regular int or a percentage number
 * @param str - css unit string
 * @param max - max unit value, used for calculating percentages
 */
function parseUnit(str: string, max: number): number {
  const isPercentage = str.indexOf('%') > -1;
  const num = parseFloat(str);
  return isPercentage ? (max / 100) * num : num;
}

/**
 * @desc Parse hex str to an int
 * @param str - hex string to parse
 */
function parseHexInt(str: string): number {
  return parseInt(str, 16);
}

/**
 * @desc Convert nunber into to 2-digit hex
 * @param int - number to convert
 */
function intToHex(int: number): string {
  return int.toString(16).padStart(2, '0');
}

export interface ColorChanges {
  h: boolean;
  s: boolean;
  v: boolean;
  a: boolean;
}

// all hsv color channels are optional by design
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

export interface KelvinColor {
  kelvin: number;
  _kelvin: number;
}

export type IroColorValue = IroColor | HsvColor | RgbColor | HslColor | KelvinColor | string;

export class IroColor {
  // internal color value storage
  private $: HsvColor;
  private onChange: Function;
  private initialValue: HsvColor;

  public index: number;
  public _kelvin: number;

  /**
    * @constructor Color object
    * @param value - initial color value
  */
  constructor(value?: IroColorValue, onChange?: Function) {
    // The default Color value
    this.$ = {h: 0, s: 0, v: 0, a: 1};
    if (value) this.set(value);
    // The watch callback function for this Color will be stored here
    this.onChange = onChange;
    this.initialValue = { ...this.$ }; // copy initial value
  }

  /**
    * @desc Set the Color from any valid value
    * @param value - new color value
  */
  public set(value: IroColorValue) {
    if (typeof value === 'string') {
      if (/^(?:#?|0x?)[0-9a-fA-F]{3,8}$/.test(value as string)) {
        this.hexString = value as string;
      }
      else if (/^rgba?/.test(value as string)) {
        this.rgbString = value as string;
      }
      else if (/^hsla?/.test(value as string)) {
        this.hslString = value as string;
      }
    }
    else if (typeof value === 'object') {
      if (value instanceof IroColor) {
        this.hsva = value.hsva;
      }
      else if ('r' in value && 'g' in value && 'b' in value) {
        this.rgb = value;
      }
      else if ('h' in value && 's' in value && 'v' in value) {
        this.hsv = value;
      }
      else if ('h' in value && 's' in value && 'l' in value) {
        this.hsl = value;
      }
      else if ('kelvin' in value) {
        this.kelvin = value.kelvin;
      }
    }
    else {
      throw new Error('Invalid color value');
    }
  }

  /**
    * @desc Shortcut to set a specific channel value
    * @param format - hsv | hsl | rgb
    * @param channel - individual channel to set, for example if model = hsl, chanel = h | s | l
    * @param value - new value for the channel
  */
  public setChannel(format: string, channel: string, value: number) {
    this[format] = {...this[format], [channel]: value};
  }

  /**
   * @desc Reset color back to its initial value
   */
  public reset() {
    this.hsva = this.initialValue;
  }

  /**
    * @desc make new Color instance with the same value as this one
  */
  public clone() {
    return new IroColor(this);
  }

  /**
   * @desc remove color onChange
   */
  public unbind() {
    this.onChange = undefined;
  }

  /**
    * @desc Convert hsv object to rgb
    * @param hsv - hsv color object
  */
  public static hsvToRgb(hsv: HsvColor): RgbColor {
    const h = hsv.h / 60;
    const s = hsv.s / 100;
    const v = hsv.v / 100;
    const i = floor(h);
    const f = h - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    const mod = i % 6;
    const r = [v, q, p, p, t, v][mod];
    const g = [t, v, v, q, p, p][mod];
    const b = [p, p, t, v, v, q][mod];
    return {
      r: clamp(r * 255, 0, 255), 
      g: clamp(g * 255, 0, 255), 
      b: clamp(b * 255, 0, 255)
    };
  }

  /**
    * @desc Convert rgb object to hsv
    * @param rgb - rgb object
  */
  public static rgbToHsv(rgb: RgbColor): HsvColor {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let hue = 0;
    let value = max;
    let saturation = max === 0 ? 0 : delta / max;
    switch (max) {
      case min: 
        hue = 0; // achromatic
        break;
      case r: 
        hue = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g: 
        hue = (b - r) / delta + 2;
        break;
      case b:
        hue = (r - g) / delta + 4;
        break;
    }
    return {
      h: (hue * 60) % 360,
      s: clamp(saturation * 100, 0, 100),
      v: clamp(value * 100, 0, 100)
    }
  }

  /**
    * @desc Convert hsv object to hsl
    * @param hsv - hsv object
  */
  public static hsvToHsl(hsv: HsvColor): HslColor {
    const s = hsv.s / 100;
    const v = hsv.v / 100;
    const l = (2 - s) * v;
    const divisor = l <= 1 ? l : (2 - l);
    // Avoid division by zero when lightness is close to zero
    const saturation = divisor < 1e-9 ? 0 : (s * v) / divisor;
    return {
      h: hsv.h,
      s: clamp(saturation * 100, 0, 100),
      l: clamp(l * 50, 0, 100)
    };
  }

  /**
    * @desc Convert hsl object to hsv
    * @param hsl - hsl object
  */
  public static hslToHsv(hsl: HslColor): HsvColor {
    const l = hsl.l * 2;
    const s = (hsl.s * ((l <= 100) ? l : 200 - l)) / 100;
    // Avoid division by zero when l + s is near 0
    const saturation = (l + s < 1e-9) ? 0 : (2 * s) / (l + s);
    return {
      h: hsl.h,
      s: clamp(saturation * 100, 0, 100),
      v: clamp((l + s) / 2, 0, 100)
    };
  }

  /**
    * @desc Convert a kelvin temperature to an approx, RGB value
    * @param kelvin - kelvin temperature
  */
  public static kelvinToRgb(kelvin: number): RgbColor {
    const temp = kelvin / 100;
    let r, g, b;
    if (temp < 66) {
      r = 255
      g = -155.25485562709179 - 0.44596950469579133 * (g = temp-2) + 104.49216199393888 * log(g)
      b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp-10) + 115.67994401066147 * log(b)
    } else {
      r = 351.97690566805693 + 0.114206453784165 * (r = temp-55) - 40.25366309332127 * log(r)
      g = 325.4494125711974 + 0.07943456536662342 * (g = temp-50) - 28.0852963507957 * log(g)
      b = 255
    }
    return {
      r: clamp(floor(r), 0, 255),
      g: clamp(floor(g), 0, 255),
      b: clamp(floor(b), 0, 255)
    };
  }

   /**
    * @desc Convert an RGB color to an approximate kelvin temperature
    * @param kelvin - kelvin temperature
  */
  public static rgbToKelvin(rgb: RgbColor): number {
    const { r, g, b } = rgb;
    const eps = 0.4;
    let minTemp = KELVIN_MIN;
    let maxTemp = KELVIN_MAX;
    let temp;
    while (maxTemp - minTemp > eps) {
      temp = (maxTemp + minTemp) * 0.5;
      const rgb = IroColor.kelvinToRgb(temp);
      if ((rgb.b / rgb.r) >= (b / r)) {
        maxTemp = temp;
      } else {
        minTemp = temp;
      }
    }
    return temp;
  }

  public get hsv(): HsvColor {
    // value is cloned to allow changes to be made to the values before passing them back
    const value = this.$;
    return {h: value.h, s: value.s, v: value.v};
  }

  public set hsv(newValue: HsvColor) {
    const oldValue = this.$;

    newValue = { ...oldValue, ...newValue };
    // If this Color is being watched for changes we need to compare the new and old values to check the difference
    // Otherwise we can just be lazy
    if (this.onChange) {
      // Compute changed values
      let changes: ColorChanges = {
        h: false,
        v: false,
        s: false,
        a: false,
      };

      for (let key in oldValue) {
        changes[key] = newValue[key] != oldValue[key]
      };
      // Update the old value
      this.$ = newValue;
      // If the value has changed, call hook callback
      if (changes.h || changes.s || changes.v || changes.a) this.onChange(this, changes);
    } else {
      this.$ = newValue;
    }
  }

  public get hsva(): HsvColor {
    return {...this.$};
  }

  public set hsva(value: HsvColor) {
    this.hsv = value;
  }

  public get hue(): number {
    return this.$.h;
  }

  public set hue(value: number) {
    this.hsv = { h: value };
  }

  public get saturation(): number {
    return this.$.s;
  }

  public set saturation(value: number) {
    this.hsv = { s: value };
  }

  public get value(): number {
    return this.$.v;
  }

  public set value(value: number) {
    this.hsv = { v: value };
  }

  public get alpha(): number {
    return this.$.a;
  }

  public set alpha(value: number) {
    this.hsv = { ...this.hsv, a: value };
  }

  public get kelvin(): number {
    /** Rgb to kelvin conversion is a little funky, producing results
     * that differ from the original value.
     * Check if rgb values are equal and return RGB to kelvin conversion
     * only if necessary
     */
    let res: number;
    let rgb = IroColor.kelvinToRgb(this._kelvin);

    if (
      rgb.r === this.rgb.r &&
      rgb.g === this.rgb.g &&
      rgb.b === this.rgb.b
    ) {
      res = this._kelvin;
    } else {
      res = IroColor.rgbToKelvin(this.rgb);
    }
    return res;
  }

  public set kelvin(value: number) {
    this.rgb = IroColor.kelvinToRgb(value);
    this._kelvin = value;
  }

  public get red(): number {
    const rgb = this.rgb;
    return rgb.r;
  }

  public set red(value: number) {
    this.rgb = { ...this.rgb, r: value };
  }

  public get green(): number {
    const rgb = this.rgb;
    return rgb.g;
  }

  public set green(value: number) {
    this.rgb = { ...this.rgb, g: value };
  }

  public get blue(): number {
    const rgb = this.rgb;
    return rgb.b;
  }

  public set blue(value: number) {
    this.rgb = { ...this.rgb, b: value };
  }

  public get rgb(): RgbColor {
    const {r, g, b} = IroColor.hsvToRgb(this.$);
    return {
      r: round(r),
      g: round(g),
      b: round(b)
    };
  }

  public set rgb(value: RgbColor) {
    this.hsv = {
      ...IroColor.rgbToHsv(value), 
      a: (value.a === undefined) ? this.alpha : value.a
    };
  }

  public get rgba(): RgbColor {
    return { ...this.rgb, a: this.alpha };
  }

  public set rgba(value: RgbColor) {
    this.rgb = value;
  }

  public get hsl(): HslColor {
    const {h, s, l} = IroColor.hsvToHsl(this.$);
    return {
      h: round(h),
      s: round(s),
      l: round(l),
    };
  }

  public set hsl(value: HslColor) {
    this.hsv = {
      ...IroColor.hslToHsv(value), 
      a: (value.a === undefined) ? this.alpha : value.a
    };
  }

  public get hsla(): HslColor {
    return { ...this.hsl, a: this.alpha };
  }

  public set hsla(value: HslColor) {
    this.hsl = value;
  }

  public get rgbString(): string {
    const rgb = this.rgb;
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  public set rgbString(value: string) {
    let match;
    let r, g, b, a = 1;
    if (match = REGEX_FUNCTIONAL_RGB.exec(value)) {
      r = parseUnit(match[1], 255);
      g = parseUnit(match[2], 255);
      b = parseUnit(match[3], 255);
    }
    else if (match = REGEX_FUNCTIONAL_RGBA.exec(value)) {
      r = parseUnit(match[1], 255);
      g = parseUnit(match[2], 255);
      b = parseUnit(match[3], 255);
      a = parseUnit(match[4], 1);
    }
    if (match) {
      this.rgb = {r, g, b, a};
    } 
    else {
      throw new Error('Invalid rgb string');
    }
  }

  public get rgbaString(): string {
    const rgba = this.rgba;
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  }

  public set rgbaString(value: string) {
    this.rgbString = value;
  }

  public get hexString(): string {
    const rgb = this.rgb;
    return `#${ intToHex(rgb.r) }${ intToHex(rgb.g) }${ intToHex(rgb.b) }`;
  }

  public set hexString(value: string) {
    let match;
    let r, g, b, a = 255;
    if (match = REGEX_HEX_3.exec(value)) {
      r = parseHexInt(match[1]) * 17;
      g = parseHexInt(match[2]) * 17;
      b = parseHexInt(match[3]) * 17;
    }
    else if (match = REGEX_HEX_4.exec(value)) {
      r = parseHexInt(match[1]) * 17;
      g = parseHexInt(match[2]) * 17;
      b = parseHexInt(match[3]) * 17;
      a = parseHexInt(match[4]) * 17;
    }
    else if (match = REGEX_HEX_6.exec(value)) {
      r = parseHexInt(match[1]);
      g = parseHexInt(match[2]);
      b = parseHexInt(match[3]);
    }
    else if (match = REGEX_HEX_8.exec(value)) {
      r = parseHexInt(match[1]);
      g = parseHexInt(match[2]);
      b = parseHexInt(match[3]);
      a = parseHexInt(match[4]);
    }
    if (match) {
      this.rgb = {r, g, b, a: a / 255};
    }
    else {
      throw new Error('Invalid hex string');
    }
  }

  public get hex8String(): string {
    const rgba = this.rgba;
    return `#${intToHex(rgba.r)}${intToHex(rgba.g)}${intToHex(rgba.b)}${intToHex(floor(rgba.a * 255))}`;
  }

  public set hex8String(value: string) {
    this.hexString = value;
  }

  public get hslString(): string {
    const hsl = this.hsl;
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }

  public set hslString(value: string) {
    let match;
    let h, s, l, a = 1;
    if (match = REGEX_FUNCTIONAL_HSL.exec(value)) {
      h = parseUnit(match[1], 360);
      s = parseUnit(match[2], 100);
      l = parseUnit(match[3], 100);
    }
    else if (match = REGEX_FUNCTIONAL_HSLA.exec(value)) {
      h = parseUnit(match[1], 360);
      s = parseUnit(match[2], 100);
      l = parseUnit(match[3], 100);
      a = parseUnit(match[4], 1);
    }
    if (match) {
      this.hsl = {h, s, l, a};
    } 
    else {
      throw new Error('Invalid hsl string');
    }
  }

  public get hslaString(): string {
    const hsla = this.hsla;
    return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`;
  }

  public set hslaString(value: string) {
    this.hslString = value;
  }
}