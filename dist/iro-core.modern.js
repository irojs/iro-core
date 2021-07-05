function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

// Some regular expressions for rgb() and hsl() Colors are borrowed from tinyColor
// https://github.com/bgrins/TinyColor
// Kelvin temperature math borrowed from Neil Barlett's implementation
// from https://github.com/neilbartlett/color-temperature
// https://www.w3.org/TR/css3-values/#integers
const CSS_INTEGER = '[-\\+]?\\d+%?'; // http://www.w3.org/TR/css3-values/#number-value

const CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?'; // Allow positive/negative integer/number. Don't capture the either/or, just the entire outcome

const CSS_UNIT = '(?:' + CSS_NUMBER + ')|(?:' + CSS_INTEGER + ')'; // Parse function params
// Parens and commas are optional, and this also allows for whitespace between numbers

const PERMISSIVE_MATCH_3 = '[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?';
const PERMISSIVE_MATCH_4 = '[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?'; // Regex patterns for functional color strings

const REGEX_FUNCTIONAL_RGB = new RegExp('rgb' + PERMISSIVE_MATCH_3);
const REGEX_FUNCTIONAL_RGBA = new RegExp('rgba' + PERMISSIVE_MATCH_4);
const REGEX_FUNCTIONAL_HSL = new RegExp('hsl' + PERMISSIVE_MATCH_3);
const REGEX_FUNCTIONAL_HSLA = new RegExp('hsla' + PERMISSIVE_MATCH_4); // Color string parsing regex

const HEX_START = '^(?:#?|0x?)';
const HEX_INT_SINGLE = '([0-9a-fA-F]{1})';
const HEX_INT_DOUBLE = '([0-9a-fA-F]{2})';
const REGEX_HEX_3 = new RegExp(HEX_START + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + '$');
const REGEX_HEX_4 = new RegExp(HEX_START + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + '$');
const REGEX_HEX_6 = new RegExp(HEX_START + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + '$');
const REGEX_HEX_8 = new RegExp(HEX_START + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + '$'); // Kelvin temperature bounds

const KELVIN_MIN = 2000;
const KELVIN_MAX = 40000; // Math shorthands

const {
  log,
  round,
  floor
} = Math;
/**
 * @desc Clamp a number between a min and max value
 * @param num - input value
 * @param min - min allowed value
 * @param max - max allowed value
 */

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}
/**
 * @desc Parse a css unit string - either regular int or a percentage number
 * @param str - css unit string
 * @param max - max unit value, used for calculating percentages
 */


function parseUnit(str, max) {
  const isPercentage = str.indexOf('%') > -1;
  const num = parseFloat(str);
  return isPercentage ? max / 100 * num : num;
}
/**
 * @desc Parse hex str to an int
 * @param str - hex string to parse
 */


function parseHexInt(str) {
  return parseInt(str, 16);
}
/**
 * @desc Convert nunber into to 2-digit hex
 * @param int - number to convert
 */


function intToHex(int) {
  return int.toString(16).padStart(2, '0');
}

class IroColor {
  /**
    * @constructor Color object
    * @param value - initial color value
  */
  constructor(value, onChange) {
    // The default Color value
    this.$ = {
      h: 0,
      s: 0,
      v: 0,
      a: 1
    };
    if (value) this.set(value); // The watch callback function for this Color will be stored here

    this.onChange = onChange;
    this.initialValue = _extends({}, this.$); // copy initial value
  }
  /**
    * @desc Set the Color from any valid value
    * @param value - new color value
  */


  set(value) {
    if (typeof value === 'string') {
      if (/^(?:#?|0x?)[0-9a-fA-F]{3,8}$/.test(value)) {
        this.hexString = value;
      } else if (/^rgba?/.test(value)) {
        this.rgbString = value;
      } else if (/^hsla?/.test(value)) {
        this.hslString = value;
      }
    } else if (typeof value === 'object') {
      if (value instanceof IroColor) {
        this.hsva = value.hsva;
      } else if ('r' in value && 'g' in value && 'b' in value) {
        this.rgb = value;
      } else if ('h' in value && 's' in value && 'v' in value) {
        this.hsv = value;
      } else if ('h' in value && 's' in value && 'l' in value) {
        this.hsl = value;
      } else if ('kelvin' in value) {
        this.kelvin = value.kelvin;
      }
    } else {
      throw new Error('Invalid color value');
    }
  }
  /**
    * @desc Shortcut to set a specific channel value
    * @param format - hsv | hsl | rgb
    * @param channel - individual channel to set, for example if model = hsl, chanel = h | s | l
    * @param value - new value for the channel
  */


  setChannel(format, channel, value) {
    this[format] = _extends({}, this[format], {
      [channel]: value
    });
  }
  /**
   * @desc Reset color back to its initial value
   */


  reset() {
    this.hsva = this.initialValue;
  }
  /**
    * @desc make new Color instance with the same value as this one
  */


  clone() {
    return new IroColor(this);
  }
  /**
   * @desc remove color onChange
   */


  unbind() {
    this.onChange = undefined;
  }
  /**
    * @desc Convert hsv object to rgb
    * @param hsv - hsv color object
  */


  static hsvToRgb(hsv) {
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


  static rgbToHsv(rgb) {
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
      h: hue * 60 % 360,
      s: clamp(saturation * 100, 0, 100),
      v: clamp(value * 100, 0, 100)
    };
  }
  /**
    * @desc Convert hsv object to hsl
    * @param hsv - hsv object
  */


  static hsvToHsl(hsv) {
    const s = hsv.s / 100;
    const v = hsv.v / 100;
    const l = (2 - s) * v;
    const divisor = l <= 1 ? l : 2 - l; // Avoid division by zero when lightness is close to zero

    const saturation = divisor < 1e-9 ? 0 : s * v / divisor;
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


  static hslToHsv(hsl) {
    const l = hsl.l * 2;
    const s = hsl.s * (l <= 100 ? l : 200 - l) / 100; // Avoid division by zero when l + s is near 0

    const saturation = l + s < 1e-9 ? 0 : 2 * s / (l + s);
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


  static kelvinToRgb(kelvin) {
    const temp = kelvin / 100;
    let r, g, b;

    if (temp < 66) {
      r = 255;
      g = -155.25485562709179 - 0.44596950469579133 * (g = temp - 2) + 104.49216199393888 * log(g);
      b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp - 10) + 115.67994401066147 * log(b);
    } else {
      r = 351.97690566805693 + 0.114206453784165 * (r = temp - 55) - 40.25366309332127 * log(r);
      g = 325.4494125711974 + 0.07943456536662342 * (g = temp - 50) - 28.0852963507957 * log(g);
      b = 255;
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


  static rgbToKelvin(rgb) {
    const {
      r,
      g,
      b
    } = rgb;
    const eps = 0.4;
    let minTemp = KELVIN_MIN;
    let maxTemp = KELVIN_MAX;
    let temp;

    while (maxTemp - minTemp > eps) {
      temp = (maxTemp + minTemp) * 0.5;

      const _rgb = IroColor.kelvinToRgb(temp);

      if (_rgb.b / _rgb.r >= b / r) {
        maxTemp = temp;
      } else {
        minTemp = temp;
      }
    }

    return temp;
  }

  get hsv() {
    // value is cloned to allow changes to be made to the values before passing them back
    const value = this.$;
    return {
      h: value.h,
      s: value.s,
      v: value.v
    };
  }

  set hsv(newValue) {
    const oldValue = this.$;
    newValue = _extends({}, oldValue, newValue); // If this Color is being watched for changes we need to compare the new and old values to check the difference
    // Otherwise we can just be lazy

    if (this.onChange) {
      // Compute changed values
      let changes = {
        h: false,
        v: false,
        s: false,
        a: false
      };

      for (let key in oldValue) {
        changes[key] = newValue[key] != oldValue[key];
      }

      this.$ = newValue; // If the value has changed, call hook callback

      if (changes.h || changes.s || changes.v || changes.a) this.onChange(this, changes);
    } else {
      this.$ = newValue;
    }
  }

  get hsva() {
    return _extends({}, this.$);
  }

  set hsva(value) {
    this.hsv = value;
  }

  get hue() {
    return this.$.h;
  }

  set hue(value) {
    this.hsv = {
      h: value
    };
  }

  get saturation() {
    return this.$.s;
  }

  set saturation(value) {
    this.hsv = {
      s: value
    };
  }

  get value() {
    return this.$.v;
  }

  set value(value) {
    this.hsv = {
      v: value
    };
  }

  get alpha() {
    return this.$.a;
  }

  set alpha(value) {
    this.hsv = _extends({}, this.hsv, {
      a: value
    });
  }

  get kelvin() {
    return IroColor.rgbToKelvin(this.rgb);
  }

  set kelvin(value) {
    this.rgb = IroColor.kelvinToRgb(value);
  }

  get red() {
    const rgb = this.rgb;
    return rgb.r;
  }

  set red(value) {
    this.rgb = _extends({}, this.rgb, {
      r: value
    });
  }

  get green() {
    const rgb = this.rgb;
    return rgb.g;
  }

  set green(value) {
    this.rgb = _extends({}, this.rgb, {
      g: value
    });
  }

  get blue() {
    const rgb = this.rgb;
    return rgb.b;
  }

  set blue(value) {
    this.rgb = _extends({}, this.rgb, {
      b: value
    });
  }

  get rgb() {
    const {
      r,
      g,
      b
    } = IroColor.hsvToRgb(this.$);
    return {
      r: round(r),
      g: round(g),
      b: round(b)
    };
  }

  set rgb(value) {
    this.hsv = _extends({}, IroColor.rgbToHsv(value), {
      a: value.a === undefined ? 1 : value.a
    });
  }

  get rgba() {
    return _extends({}, this.rgb, {
      a: this.alpha
    });
  }

  set rgba(value) {
    this.rgb = value;
  }

  get hsl() {
    const {
      h,
      s,
      l
    } = IroColor.hsvToHsl(this.$);
    return {
      h: round(h),
      s: round(s),
      l: round(l)
    };
  }

  set hsl(value) {
    this.hsv = _extends({}, IroColor.hslToHsv(value), {
      a: value.a === undefined ? 1 : value.a
    });
  }

  get hsla() {
    return _extends({}, this.hsl, {
      a: this.alpha
    });
  }

  set hsla(value) {
    this.hsl = value;
  }

  get rgbString() {
    const rgb = this.rgb;
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  set rgbString(value) {
    let match;
    let r,
        g,
        b,
        a = 1;

    if (match = REGEX_FUNCTIONAL_RGB.exec(value)) {
      r = parseUnit(match[1], 255);
      g = parseUnit(match[2], 255);
      b = parseUnit(match[3], 255);
    } else if (match = REGEX_FUNCTIONAL_RGBA.exec(value)) {
      r = parseUnit(match[1], 255);
      g = parseUnit(match[2], 255);
      b = parseUnit(match[3], 255);
      a = parseUnit(match[4], 1);
    }

    if (match) {
      this.rgb = {
        r,
        g,
        b,
        a
      };
    } else {
      throw new Error('Invalid rgb string');
    }
  }

  get rgbaString() {
    const rgba = this.rgba;
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  }

  set rgbaString(value) {
    this.rgbString = value;
  }

  get hexString() {
    const rgb = this.rgb;
    return `#${intToHex(rgb.r)}${intToHex(rgb.g)}${intToHex(rgb.b)}`;
  }

  set hexString(value) {
    let match;
    let r,
        g,
        b,
        a = 255;

    if (match = REGEX_HEX_3.exec(value)) {
      r = parseHexInt(match[1]) * 17;
      g = parseHexInt(match[2]) * 17;
      b = parseHexInt(match[3]) * 17;
    } else if (match = REGEX_HEX_4.exec(value)) {
      r = parseHexInt(match[1]) * 17;
      g = parseHexInt(match[2]) * 17;
      b = parseHexInt(match[3]) * 17;
      a = parseHexInt(match[4]) * 17;
    } else if (match = REGEX_HEX_6.exec(value)) {
      r = parseHexInt(match[1]);
      g = parseHexInt(match[2]);
      b = parseHexInt(match[3]);
    } else if (match = REGEX_HEX_8.exec(value)) {
      r = parseHexInt(match[1]);
      g = parseHexInt(match[2]);
      b = parseHexInt(match[3]);
      a = parseHexInt(match[4]);
    }

    if (match) {
      this.rgb = {
        r,
        g,
        b,
        a: a / 255
      };
    } else {
      throw new Error('Invalid hex string');
    }
  }

  get hex8String() {
    const rgba = this.rgba;
    return `#${intToHex(rgba.r)}${intToHex(rgba.g)}${intToHex(rgba.b)}${intToHex(floor(rgba.a * 255))}`;
  }

  set hex8String(value) {
    this.hexString = value;
  }

  get hslString() {
    const hsl = this.hsl;
    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  }

  set hslString(value) {
    let match;
    let h,
        s,
        l,
        a = 1;

    if (match = REGEX_FUNCTIONAL_HSL.exec(value)) {
      h = parseUnit(match[1], 360);
      s = parseUnit(match[2], 100);
      l = parseUnit(match[3], 100);
    } else if (match = REGEX_FUNCTIONAL_HSLA.exec(value)) {
      h = parseUnit(match[1], 360);
      s = parseUnit(match[2], 100);
      l = parseUnit(match[3], 100);
      a = parseUnit(match[4], 1);
    }

    if (match) {
      this.hsl = {
        h,
        s,
        l,
        a
      };
    } else {
      throw new Error('Invalid hsl string');
    }
  }

  get hslaString() {
    const hsla = this.hsla;
    return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`;
  }

  set hslaString(value) {
    this.hslString = value;
  }

}

const sliderDefaultOptions = {
  sliderShape: 'bar',
  sliderType: 'value',
  minTemperature: 2200,
  maxTemperature: 11000
};
/**
 * @desc Get the CSS styles for the slider root
 * @param props - slider props
 */

function getSliderStyles(props) {
  return {
    [props.layoutDirection === 'horizontal' ? 'marginLeft' : 'marginTop']: props.sliderMargin
  };
}
/**
 * @desc Get the bounding dimensions of the slider
 * @param props - slider props
 */

function getSliderDimensions(props) {
  var _sliderSize;

  let {
    width,
    sliderSize: sliderSize,
    borderWidth,
    handleRadius,
    padding,
    sliderShape
  } = props;
  const ishorizontal = props.layoutDirection === 'horizontal'; // automatically calculate sliderSize if its not defined

  sliderSize = (_sliderSize = sliderSize) != null ? _sliderSize : padding * 2 + handleRadius * 2;

  if (sliderShape === 'circle') {
    return {
      handleStart: props.padding + props.handleRadius,
      handleRange: width - padding * 2 - handleRadius * 2,
      width: width,
      height: width,
      cx: width / 2,
      cy: width / 2,
      radius: width / 2 - borderWidth / 2
    };
  } else {
    return {
      handleStart: sliderSize / 2,
      handleRange: width - sliderSize,
      radius: sliderSize / 2,
      x: 0,
      y: 0,
      width: ishorizontal ? sliderSize : width,
      height: ishorizontal ? width : sliderSize
    };
  }
}
/**
 * @desc Get the current slider value for a given color, as a percentage
 * @param props - slider props
 * @param color
 */

function getCurrentSliderValue(props, color) {
  const hsva = color.hsva;
  const rgb = color.rgb;

  switch (props.sliderType) {
    case 'red':
      return rgb.r / 2.55;

    case 'green':
      return rgb.g / 2.55;

    case 'blue':
      return rgb.b / 2.55;

    case 'alpha':
      return hsva.a * 100;

    case 'kelvin':
      const {
        minTemperature,
        maxTemperature
      } = props;
      const temperatureRange = maxTemperature - minTemperature;
      const percent = (color.kelvin - minTemperature) / temperatureRange * 100; // clmap percentage

      return Math.max(0, Math.min(percent, 100));

    case 'hue':
      return hsva.h /= 3.6;

    case 'saturation':
      return hsva.s;

    case 'value':
    default:
      return hsva.v;
  }
}
/**
 * @desc Get the current slider value from user input
 * @param props - slider props
 * @param x - global input x position
 * @param y - global input y position
 */

function getSliderValueFromInput(props, x, y) {
  const {
    handleRange,
    handleStart
  } = getSliderDimensions(props);
  let handlePos;

  if (props.layoutDirection === 'horizontal') {
    handlePos = -1 * y + handleRange + handleStart;
  } else {
    handlePos = x - handleStart;
  } // clamp handle position


  handlePos = Math.max(Math.min(handlePos, handleRange), 0);
  const percent = Math.round(100 / handleRange * handlePos);

  switch (props.sliderType) {
    case 'kelvin':
      const {
        minTemperature,
        maxTemperature
      } = props;
      const temperatureRange = maxTemperature - minTemperature;
      return minTemperature + temperatureRange * (percent / 100);

    case 'alpha':
      return percent / 100;

    case 'hue':
      return percent * 3.6;

    case 'red':
    case 'blue':
    case 'green':
      return percent * 2.55;

    default:
      return percent;
  }
}
/**
 * @desc Get the current handle position for a given color
 * @param props - slider props
 * @param color
 */

function getSliderHandlePosition(props, color) {
  const {
    width,
    height,
    handleRange,
    handleStart
  } = getSliderDimensions(props);
  const ishorizontal = props.layoutDirection === 'horizontal';
  const sliderValue = getCurrentSliderValue(props, color);
  const midPoint = ishorizontal ? width / 2 : height / 2;
  let handlePos = handleStart + sliderValue / 100 * handleRange;

  if (ishorizontal) {
    handlePos = -1 * handlePos + handleRange + handleStart * 2;
  }

  return {
    x: ishorizontal ? midPoint : handlePos,
    y: ishorizontal ? handlePos : midPoint
  };
}
/**
 * @desc Get the gradient stops for a slider
 * @param props - slider props
 * @param color
 */

function getSliderGradient(props, color) {
  const hsv = color.hsv;
  const rgb = color.rgb;

  switch (props.sliderType) {
    case 'red':
      return [[0, `rgb(${0},${rgb.g},${rgb.b})`], [100, `rgb(${255},${rgb.g},${rgb.b})`]];

    case 'green':
      return [[0, `rgb(${rgb.r},${0},${rgb.b})`], [100, `rgb(${rgb.r},${255},${rgb.b})`]];

    case 'blue':
      return [[0, `rgb(${rgb.r},${rgb.g},${0})`], [100, `rgb(${rgb.r},${rgb.g},${255})`]];

    case 'alpha':
      return [[0, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`], [100, `rgb(${rgb.r},${rgb.g},${rgb.b})`]];

    case 'kelvin':
      const stops = [];
      const min = props.minTemperature;
      const max = props.maxTemperature;
      const numStops = 8;
      const range = max - min;

      for (let kelvin = min, stop = 0; kelvin < max; kelvin += range / numStops, stop += 1) {
        const {
          r,
          g,
          b
        } = IroColor.kelvinToRgb(kelvin);
        stops.push([100 / numStops * stop, `rgb(${r},${g},${b})`]);
      }

      return stops;

    case 'hue':
      return [[0, '#f00'], [16.666, '#ff0'], [33.333, '#0f0'], [50, '#0ff'], [66.666, '#00f'], [83.333, '#f0f'], [100, '#f00']];

    case 'saturation':
      const noSat = IroColor.hsvToHsl({
        h: hsv.h,
        s: 0,
        v: hsv.v
      });
      const fullSat = IroColor.hsvToHsl({
        h: hsv.h,
        s: 100,
        v: hsv.v
      });
      return [[0, `hsl(${noSat.h},${noSat.s}%,${noSat.l}%)`], [100, `hsl(${fullSat.h},${fullSat.s}%,${fullSat.l}%)`]];

    case 'value':
    default:
      const hsl = IroColor.hsvToHsl({
        h: hsv.h,
        s: hsv.s,
        v: 100
      });
      return [[0, '#000'], [100, `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`]];
  }
}
/**
 * @desc Get the gradient coords for a slider
 * @param props - slider props
 */

function getSliderGradientCoords(props) {
  const ishorizontal = props.layoutDirection === 'horizontal';
  return {
    x1: '0%',
    y1: ishorizontal ? '100%' : '0%',
    x2: ishorizontal ? '0%' : '100%',
    y2: '0%'
  };
}

const TAU = Math.PI * 2; // javascript's modulo operator doesn't produce positive numbers with negative input
// https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e

const mod = (a, n) => (a % n + n) % n; // distance between points (x, y) and (0, 0)


const dist = (x, y) => Math.sqrt(x * x + y * y);
/**
 * @param props - wheel props
 * @internal
 */


function getHandleRange(props) {
  return props.width / 2 - props.padding - props.handleRadius - props.borderWidth;
}
/**
 * Returns true if point (x, y) lands inside the wheel
 * @param props - wheel props
 * @param x
 * @param y
 */


function isInputInsideWheel(props, x, y) {
  const {
    cx,
    cy
  } = getWheelDimensions(props);
  const r = props.width / 2;
  return dist(cx - x, cy - y) < r;
}
/**
 * @desc Get the point as the center of the wheel
 * @param props - wheel props
 */

function getWheelDimensions(props) {
  const r = props.width / 2;
  return {
    width: props.width,
    radius: r - props.borderWidth,
    cx: r,
    cy: r
  };
}
/**
 * @desc Translate an angle according to wheelAngle and wheelDirection
 * @param props - wheel props
 * @param angle - input angle
 */

function translateWheelAngle(props, angle, invert) {
  const wheelAngle = props.wheelAngle;
  const wheelDirection = props.wheelDirection; // inverted and clockwisee

  if (invert && wheelDirection === 'clockwise') angle = wheelAngle + angle; // clockwise (input handling)
  else if (wheelDirection === 'clockwise') angle = 360 - wheelAngle + angle; // inverted and anticlockwise
    else if (invert && wheelDirection === 'anticlockwise') angle = wheelAngle + 180 - angle; // anticlockwise (input handling)
      else if (wheelDirection === 'anticlockwise') angle = wheelAngle - angle;
  return mod(angle, 360);
}
/**
 * @desc Get the current handle position for a given color
 * @param props - wheel props
 * @param color
 */

function getWheelHandlePosition(props, color) {
  const hsv = color.hsv;
  const {
    cx,
    cy
  } = getWheelDimensions(props);
  const handleRange = getHandleRange(props);
  const handleAngle = (180 + translateWheelAngle(props, hsv.h, true)) * (TAU / 360);
  const handleDist = hsv.s / 100 * handleRange;
  const direction = props.wheelDirection === 'clockwise' ? -1 : 1;
  return {
    x: cx + handleDist * Math.cos(handleAngle) * direction,
    y: cy + handleDist * Math.sin(handleAngle) * direction
  };
}
/**
 * @desc Get the current wheel value from user input
 * @param props - wheel props
 * @param x - global input x position
 * @param y - global input y position
 */

function getWheelValueFromInput(props, x, y) {
  const {
    cx,
    cy
  } = getWheelDimensions(props);
  const handleRange = getHandleRange(props);
  x = cx - x;
  y = cy - y; // Calculate the hue by converting the angle to radians

  const hue = translateWheelAngle(props, Math.atan2(-y, -x) * (360 / TAU)); // Find the point's distance from the center of the wheel
  // This is used to show the saturation level

  const handleDist = Math.min(dist(x, y), handleRange);
  return {
    h: Math.round(hue),
    s: Math.round(100 / handleRange * handleDist)
  };
}

/**
 * @desc Get the CSS styles for the box root element
 * @param props - box props
 */
function getBoxStyles(props) {
  return {
    [props.layoutDirection === 'horizontal' ? 'marginLeft' : 'marginTop']: props.sliderMargin
  };
}
/**
 * @desc Get the bounding dimensions of the box
 * @param props - box props
 */

function getBoxDimensions(props) {
  const {
    width,
    boxHeight,
    padding,
    handleRadius
  } = props;
  return {
    width: width,
    height: boxHeight != null ? boxHeight : width,
    radius: padding + handleRadius
  };
}
/**
 * @desc Get the current box value from user input
 * @param props - box props
 * @param x - global input x position
 * @param y - global input y position
 */

function getBoxValueFromInput(props, x, y) {
  const {
    width,
    height,
    radius
  } = getBoxDimensions(props);
  const handleStart = radius;
  const handleRangeX = width - radius * 2;
  const handleRangeY = height - radius * 2;
  const percentX = (x - handleStart) / handleRangeX * 100;
  const percentY = (y - handleStart) / handleRangeY * 100;
  return {
    s: Math.max(0, Math.min(percentX, 100)),
    v: Math.max(0, Math.min(100 - percentY, 100))
  };
}
/**
 * @desc Get the current box handle position for a given color
 * @param props - box props
 * @param color
 */

function getBoxHandlePosition(props, color) {
  const {
    width,
    height,
    radius
  } = getBoxDimensions(props);
  const hsv = color.hsv;
  const handleStart = radius;
  const handleRangeX = width - radius * 2;
  const handleRangeY = height - radius * 2;
  return {
    x: handleStart + hsv.s / 100 * handleRangeX,
    y: handleStart + (handleRangeY - hsv.v / 100 * handleRangeY)
  };
}
/**
 * @desc Get the gradient stops for a box
 * @param props - box props
 * @param color
 */

function getBoxGradients(props, color) {
  const hue = color.hue;
  return [// saturation gradient
  [[0, '#fff'], [100, `hsl(${hue},100%,50%)`]], // lightness gradient
  [[0, 'rgba(0,0,0,0)'], [100, '#000']]];
}

// Keep track of html <base> elements for resolveSvgUrl
// getElementsByTagName returns a live HTMLCollection, which stays in sync with the DOM tree
// So it only needs to be called once
let BASE_ELEMENTS;
/**
 * @desc Resolve an SVG reference URL
 * This is required to work around how Safari and iOS webviews handle gradient URLS under certain conditions
 * If a page is using a client-side routing library which makes use of the HTML <base> tag,
 * Safari won't be able to render SVG gradients properly (as they are referenced by URLs)
 * More info on the problem:
 * https://stackoverflow.com/questions/19742805/angular-and-svg-filters/19753427#19753427
 * https://github.com/jaames/iro.js/issues/18
 * https://github.com/jaames/iro.js/issues/45
 * https://github.com/jaames/iro.js/pull/89
 * @props url - SVG reference URL
 */

function resolveSvgUrl(url) {
  if (!BASE_ELEMENTS) BASE_ELEMENTS = document.getElementsByTagName('base'); // Sniff useragent string to check if the user is running Safari

  const ua = window.navigator.userAgent;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isIos = /iPhone|iPod|iPad/i.test(ua);
  const location = window.location;
  return (isSafari || isIos) && BASE_ELEMENTS.length > 0 ? `${location.protocol}//${location.host}${location.pathname}${location.search}${url}` : url;
}
/**
 * @desc Get the path commands to draw an svg arc
 * @props cx - arc center point x
 * @props cy - arc center point y
 * @props radius - arc radius
 * @props startAngle - arc start angle
 * @props endAngle - arc end angle
 */

function getSvgArcPath(cx, cy, radius, startAngle, endAngle) {
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  startAngle *= Math.PI / 180;
  endAngle *= Math.PI / 180;
  const x1 = cx + radius * Math.cos(endAngle);
  const y1 = cy + radius * Math.sin(endAngle);
  const x2 = cx + radius * Math.cos(startAngle);
  const y2 = cy + radius * Math.sin(startAngle);
  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${x2} ${y2}`;
}
/**
 * @desc Given a specifc (x, y) position, test if there's a handle there and return its index, else return null.
 *       This is used for components like the box and wheel which support multiple handles when multicolor is active
 * @props x - point x position
 * @props y - point y position
 * @props handlePositions - array of {x, y} coords for each handle
 */

function getHandleAtPoint(props, x, y, handlePositions) {
  for (let i = 0; i < handlePositions.length; i++) {
    const dX = handlePositions[i].x - x;
    const dY = handlePositions[i].y - y;
    const dist = Math.sqrt(dX * dX + dY * dY);

    if (dist < props.handleRadius) {
      return i;
    }
  }

  return null;
}

function cssBorderStyles(props) {
  return {
    boxSizing: 'border-box',
    border: `${props.borderWidth}px solid ${props.borderColor}`
  };
}
function cssGradient(type, direction, stops) {
  return `${type}-gradient(${direction}, ${stops.map(([o, col]) => `${col} ${o}%`).join(',')})`;
}
function cssValue(value) {
  if (typeof value === 'string') return value;
  return `${value}px`;
}

const iroColorPickerOptionDefaults = {
  width: 300,
  height: 300,
  color: '#fff',
  colors: [],
  padding: 6,
  layoutDirection: 'vertical',
  borderColor: '#fff',
  borderWidth: 0,
  handleRadius: 8,
  activeHandleRadius: null,
  handleSvg: null,
  handleProps: {
    x: 0,
    y: 0
  },
  wheelLightness: true,
  wheelAngle: 0,
  wheelDirection: 'anticlockwise',
  sliderSize: null,
  sliderMargin: 12,
  boxHeight: null
};

export { IroColor, cssBorderStyles, cssGradient, cssValue, getBoxDimensions, getBoxGradients, getBoxHandlePosition, getBoxStyles, getBoxValueFromInput, getCurrentSliderValue, getHandleAtPoint, getSliderDimensions, getSliderGradient, getSliderGradientCoords, getSliderHandlePosition, getSliderStyles, getSliderValueFromInput, getSvgArcPath, getWheelDimensions, getWheelHandlePosition, getWheelValueFromInput, iroColorPickerOptionDefaults, isInputInsideWheel, resolveSvgUrl, sliderDefaultOptions, translateWheelAngle };
//# sourceMappingURL=iro-core.modern.js.map
