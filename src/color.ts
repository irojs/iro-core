// Some regular expressions for rgb() and hsl() Colors are borrowed from tinyColor
// https://github.com/bgrins/TinyColor

// https://www.w3.org/TR/css3-values/#integers
const CSS_INTEGER = `[-\\+]?\\d+%?`;
// http://www.w3.org/TR/css3-values/#number-value
const CSS_NUMBER = `[-\\+]?\\d*\\.\\d+%?`;
// Allow positive/negative integer/number. Don't capture the either/or, just the entire outcome
const CSS_UNIT = `(?:${ CSS_NUMBER })|(?:${ CSS_INTEGER })`;

// Parse function params
// Parens and commas are optional, and this also allows for whitespace between numbers
const PERMISSIVE_MATCH_3 = `[\\s|\\(]+(${ CSS_UNIT })[,|\\s]+(${ CSS_UNIT })[,|\\s]+(${ CSS_UNIT })\\s*\\)?`;
const PERMISSIVE_MATCH_4 = `[\\s|\\(]+(${ CSS_UNIT })[,|\\s]+(${ CSS_UNIT })[,|\\s]+(${ CSS_UNIT })[,|\\s]+(${ CSS_UNIT })\\s*\\)?`;

// Regex patterns for functional colors
const REGEX_FUNCTIONAL_RGB = new RegExp(`rgb${ PERMISSIVE_MATCH_3 }`);
const REGEX_FUNCTIONAL_RGBA = new RegExp(`rgba${ PERMISSIVE_MATCH_4 }`);
const REGEX_FUNCTIONAL_HSL = new RegExp(`hsl${ PERMISSIVE_MATCH_3 }`);
const REGEX_FUNCTIONAL_HSLA = new RegExp(`hsla${ PERMISSIVE_MATCH_4 }`);

const HEX_START = `^(?:#?|0x?)`;
const HEX_INT_SINGLE = `([0-9a-fA-F]{1})`;
const HEX_INT_DOUBLE = `([0-9a-fA-F]{2})`;
const REGEX_HEX_3 = new RegExp(`${ HEX_START }${ HEX_INT_SINGLE }${ HEX_INT_SINGLE }${ HEX_INT_SINGLE }$`);
const REGEX_HEX_4 = new RegExp(`${ HEX_START }${ HEX_INT_SINGLE }${ HEX_INT_SINGLE }${ HEX_INT_SINGLE }${ HEX_INT_SINGLE }$`);
const REGEX_HEX_6 = new RegExp(`${ HEX_START }${ HEX_INT_DOUBLE }${ HEX_INT_DOUBLE }${ HEX_INT_DOUBLE }$`);
const REGEX_HEX_8 = new RegExp(`${ HEX_START }${ HEX_INT_DOUBLE }${ HEX_INT_DOUBLE }${ HEX_INT_DOUBLE }${ HEX_INT_DOUBLE }$`);

/**
 * Parse a css unit string - either regular int or a percentage number
 */
function parseUnit(str: string, max: number): number {
  const isPercentage = str.indexOf('%') > -1;
  const num = parseFloat(str);
  return isPercentage ? (max / 100) * num : num;
}

/**
 * Parse hex str to an int
 */
function parseHexInt(str: string): number {
  return parseInt(str, 16);
}

/**
 * Convert into to 2-digit hex
 */
function intToHex(int: number): string {
  return int.toString(16).padStart(2, '0');
}

interface ColorChanges {
  h: boolean;
  s: boolean;
  v: boolean;
  a?: boolean;
}

interface HsvColor {
  h: number;
  s: number;
  v: number;
  a?: number;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

interface HslColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export type IroColorValue = IroColor | HsvColor | RgbColor | HslColor | string;

export class IroColor {
  public onChange: Function;
  public value: HsvColor;
  /**
    * @constructor Color object
    * @param {Object | String | IroColor} value - Color instance, object (hsv, hsl or rgb), string (hsl, rgb, hex)
  */
  constructor(value?: IroColorValue, onChange?: Function) {
    // The default Color value
    this.value = {h: 0, s: 0, v: 0, a: 1};
    if (value) this.set(value);
    // The watch callback function for this Color will be stored here
    this.onChange = onChange;
  }

  /**
    * @desc set the Color from any valid value
    * @param {Object | String | IroColor} value - Color instance, object (hsv, hsl or rgb), string (hsl, rgb, hex)
  */
  public set(value: IroColorValue) {
    const isString = typeof value === 'string';
    const isObject = typeof value === 'object';
    if (typeof value === 'string' && (/^(?:#?|0x?)[0-9a-fA-F]{3,8}$/.test(value as string))) {
      this.hexString = value as string;
    }
    else if (typeof value === 'string' && (/^rgba?/.test(value as string))) {
      this.rgbString = value as string;
    }
    else if (typeof value === 'string' && (/^hsla?/.test(value as string))) {
      this.hslString = value as string;
    }
    else if (typeof value === 'object' && (value instanceof IroColor)) {
      this.hsv = value.hsv;
    }
    else if (typeof value === 'object' && ('r' in value) && ('g' in value) && ('b' in value)) {
      this.rgb = value;
    }
    else if (typeof value === 'object' && ('h' in value) && ('s' in value) && ('v' in value)) {
      this.hsv = value;
    }
    else if (typeof value === 'object' && ('h' in value) && ('s' in value) && ('l' in value)) {
      this.hsl = value;
    }
    else {
      throw new Error('invalid color value');
    }
  }

  /**
    * @desc shortcut to set a specific channel value
    * @param {String} format - hsv | hsl | rgb
    * @param {String} channel - individual channel to set, for example if model = hsl, chanel = h | s | l
    * @param {Number} value - new value for the channel
  */
  public setChannel(format: string, channel: string, value: number) {
    this[format] = {...this[format], [channel]: value};
  }

  /**
    * @desc make new Color instance with the same value as this one
    * @return {IroColor}
  */
  public clone() {
    return new IroColor(this);
  }

  /**
    * @desc convert hsv object to rgb
    * @param {Object} hsv hsv object
    * @return {Object} rgb object
  */
  public static hsvToRgb(hsv: HsvColor): RgbColor {
    const h = hsv.h / 60;
    const s = hsv.s / 100;
    const v = hsv.v / 100;
    const i = Math.floor(h);
    const f = h - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    const mod = i % 6;
    const r = [v, q, p, p, t, v][mod];
    const g = [t, v, v, q, p, p][mod];
    const b = [p, p, t, v, v, q][mod];
    return {
      r: r * 255, 
      g: g * 255, 
      b: b * 255
    };
  }

  /**
    * @desc convert rgb object to hsv
    * @param {Object} rgb - rgb object
    * @return {Object} hsv object
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
      h: hue * 60,
      s: saturation * 100,
      v: value * 100
    }
  }

  /**
    * @desc convert hsv object to hsl
    * @param {Object} hsv - hsv object
    * @return {Object} hsl object
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
      s: saturation * 100,
      l: l * 50
    };
  }

  /**
    * @desc convert hsl object to hsv
    * @param {Object} hsl - hsl object
    * @return {Object} hsv object
  */
  public static hslToHsv(hsl: HslColor): HsvColor {
    const l = hsl.l * 2;
    const s = (hsl.s * ((l <= 100) ? l : 200 - l)) / 100;
    // Avoid division by zero when l + s is near 0
    const saturation = (l + s < 1e-9) ? 0 : (2 * s) / (l + s);
    return {
      h: hsl.h,
      s: saturation * 100,
      v: (l + s) / 2
    };
  }

  public static kelvinToRgb(kelvin: number): RgbColor {
    const temp = kelvin / 100;
    let r,g,b;
    if (temp < 66) {
        r = 255
        g = -155.25485562709179 - 0.44596950469579133 * (g = temp-2) + 104.49216199393888 * Math.log(g)
        b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp-10) + 115.67994401066147 * Math.log(b)
    } else {
        r = 351.97690566805693 + 0.114206453784165 * (r = temp-55) - 40.25366309332127 * Math.log(r)
        g = 325.4494125711974 + 0.07943456536662342 * (g = temp-50) - 28.0852963507957 * Math.log(g)
        b = 255
    }
    return {r, g, b};
  }

  public static rgbToKelvin(rgb: RgbColor): number {
    const { r, g, b } = rgb;
    let minTemp = 1000;
    let maxTemp = 40000;
    const eps = 0.4;
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

  public get hsv() {
    // _value is cloned to allow changes to be made to the values before passing them back
    const value = this.value;
    return {h: value.h, s: value.s, v: value.v};
  }

  public set hsv(newValue: any) {
    const oldValue = this.value;

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
      this.value = newValue;
      // If the value has changed, call hook callback
      if (changes.h || changes.s || changes.v || changes.a) this.onChange(this, changes);
    } else {
      this.value = newValue;
    }
  }

  public get rgb() {
    const {r, g, b} = IroColor.hsvToRgb(this.value);
    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
    };
  }

  public set rgb(value: any) {
    this.hsv = {
      ...IroColor.rgbToHsv(value), 
      a: (value.a === undefined) ? 1 : value.a
    };
  }

  public get hsl() {
    const {h, s, l} = IroColor.hsvToHsl(this.value);
    return {
      h: Math.round(h),
      s: Math.round(s),
      l: Math.round(l),
    };
  }

  public set hsl(value: any) {
    this.hsv = {
      ...IroColor.hslToHsv(value), 
      a: (value.a === undefined) ? 1 : value.a
    };
  }

  public get kelvin() {
    return IroColor.rgbToKelvin(this.rgb);
  }

  public set kelvin(value: number) {
    this.rgb = IroColor.kelvinToRgb(value);
  }

  public get rgbString() {
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
      throw new Error('invalid rgb string');
    }
  }

  public get hexString() {
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
      throw new Error('invalid hex string');
    }
  }

  public get hslString() {
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
      throw new Error('invalid hsl string');
    }
  }
}