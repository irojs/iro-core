(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.iroCore = {})));
}(this, (function (exports) {
  // Some regular expressions for rgb() and hsl() Colors are borrowed from tinyColor
  // https://github.com/bgrins/TinyColor
  // Kelvin temperature math borrowed from Neil Barlett's implementation
  // from https://github.com/neilbartlett/color-temperature
  // https://www.w3.org/TR/css3-values/#integers
  var CSS_INTEGER = '[-\\+]?\\d+%?'; // http://www.w3.org/TR/css3-values/#number-value

  var CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?'; // Allow positive/negative integer/number. Don't capture the either/or, just the entire outcome

  var CSS_UNIT = '(?:' + CSS_NUMBER + ')|(?:' + CSS_INTEGER + ')'; // Parse function params
  // Parens and commas are optional, and this also allows for whitespace between numbers

  var PERMISSIVE_MATCH_3 = '[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?';
  var PERMISSIVE_MATCH_4 = '[\\s|\\(]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')[,|\\s]+(' + CSS_UNIT + ')\\s*\\)?'; // Regex patterns for functional color strings

  var REGEX_FUNCTIONAL_RGB = new RegExp('rgb' + PERMISSIVE_MATCH_3);
  var REGEX_FUNCTIONAL_RGBA = new RegExp('rgba' + PERMISSIVE_MATCH_4);
  var REGEX_FUNCTIONAL_HSL = new RegExp('hsl' + PERMISSIVE_MATCH_3);
  var REGEX_FUNCTIONAL_HSLA = new RegExp('hsla' + PERMISSIVE_MATCH_4); // Color string parsing regex

  var HEX_START = '^(?:#?|0x?)';
  var HEX_INT_SINGLE = '([0-9a-fA-F]{1})';
  var HEX_INT_DOUBLE = '([0-9a-fA-F]{2})';
  var REGEX_HEX_3 = new RegExp(HEX_START + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + '$');
  var REGEX_HEX_4 = new RegExp(HEX_START + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + HEX_INT_SINGLE + '$');
  var REGEX_HEX_6 = new RegExp(HEX_START + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + '$');
  var REGEX_HEX_8 = new RegExp(HEX_START + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + HEX_INT_DOUBLE + '$'); // Kelvin temperature bounds

  var KELVIN_MIN = 1000;
  var KELVIN_MAX = 40000; // Math shorthands

  var log = Math.log;
  var round = Math.round;
  var floor = Math.floor;
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
    var isPercentage = str.indexOf('%') > -1;
    var num = parseFloat(str);
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

  var IroColor = function IroColor(value, onChange) {
    // The default Color value
    this.$ = {
      h: 0,
      s: 0,
      v: 0,
      a: 1
    };
    if (value) { this.set(value); } // The watch callback function for this Color will be stored here

    this.onChange = onChange;
    this.initialValue = Object.assign({}, this.$); // copy initial value
  };

  var prototypeAccessors = { hsv: { configurable: true },hsva: { configurable: true },hue: { configurable: true },saturation: { configurable: true },value: { configurable: true },alpha: { configurable: true },kelvin: { configurable: true },red: { configurable: true },green: { configurable: true },blue: { configurable: true },rgb: { configurable: true },rgba: { configurable: true },hsl: { configurable: true },hsla: { configurable: true },rgbString: { configurable: true },rgbaString: { configurable: true },hexString: { configurable: true },hex8String: { configurable: true },hslString: { configurable: true },hslaString: { configurable: true } };
  /**
    * @desc Set the Color from any valid value
    * @param value - new color value
  */


  IroColor.prototype.set = function set (value) {
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
        this.hsv = value.hsv;
      } else if (typeof value === 'object' && 'r' in value && 'g' in value && 'b' in value) {
        this.rgb = value;
      } else if (typeof value === 'object' && 'h' in value && 's' in value && 'v' in value) {
        this.hsv = value;
      } else if (typeof value === 'object' && 'h' in value && 's' in value && 'l' in value) {
        this.hsl = value;
      }
    } else {
      throw new Error('Invalid color value');
    }
  };
  /**
    * @desc Shortcut to set a specific channel value
    * @param format - hsv | hsl | rgb
    * @param channel - individual channel to set, for example if model = hsl, chanel = h | s | l
    * @param value - new value for the channel
  */


  IroColor.prototype.setChannel = function setChannel (format, channel, value) {
      var obj;

    this[format] = Object.assign({}, this[format],
      ( obj = {}, obj[channel] = value, obj ));
  };
  /**
   * @desc Reset color back to its initial value
   */


  IroColor.prototype.reset = function reset () {
    this.hsva = this.initialValue;
  };
  /**
    * @desc make new Color instance with the same value as this one
  */


  IroColor.prototype.clone = function clone () {
    return new IroColor(this);
  };
  /**
   * @desc remove color onChange
   */


  IroColor.prototype.unbind = function unbind () {
    this.onChange = undefined;
  };
  /**
    * @desc Convert hsv object to rgb
    * @param hsv - hsv color object
  */


  IroColor.hsvToRgb = function hsvToRgb (hsv) {
    var h = hsv.h / 60;
    var s = hsv.s / 100;
    var v = hsv.v / 100;
    var i = floor(h);
    var f = h - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var mod = i % 6;
    var r = [v, q, p, p, t, v][mod];
    var g = [t, v, v, q, p, p][mod];
    var b = [p, p, t, v, v, q][mod];
    return {
      r: clamp(r * 255, 0, 255),
      g: clamp(g * 255, 0, 255),
      b: clamp(b * 255, 0, 255)
    };
  };
  /**
    * @desc Convert rgb object to hsv
    * @param rgb - rgb object
  */


  IroColor.rgbToHsv = function rgbToHsv (rgb) {
    var r = rgb.r / 255;
    var g = rgb.g / 255;
    var b = rgb.b / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var delta = max - min;
    var hue = 0;
    var value = max;
    var saturation = max === 0 ? 0 : delta / max;

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
  };
  /**
    * @desc Convert hsv object to hsl
    * @param hsv - hsv object
  */


  IroColor.hsvToHsl = function hsvToHsl (hsv) {
    var s = hsv.s / 100;
    var v = hsv.v / 100;
    var l = (2 - s) * v;
    var divisor = l <= 1 ? l : 2 - l; // Avoid division by zero when lightness is close to zero

    var saturation = divisor < 1e-9 ? 0 : s * v / divisor;
    return {
      h: hsv.h,
      s: clamp(saturation * 100, 0, 100),
      l: clamp(l * 50, 0, 100)
    };
  };
  /**
    * @desc Convert hsl object to hsv
    * @param hsl - hsl object
  */


  IroColor.hslToHsv = function hslToHsv (hsl) {
    var l = hsl.l * 2;
    var s = hsl.s * (l <= 100 ? l : 200 - l) / 100; // Avoid division by zero when l + s is near 0

    var saturation = l + s < 1e-9 ? 0 : 2 * s / (l + s);
    return {
      h: hsl.h,
      s: clamp(saturation * 100, 0, 100),
      v: clamp((l + s) / 2, 0, 100)
    };
  };
  /**
    * @desc Convert a kelvin temperature to an approx, RGB value
    * @param kelvin - kelvin temperature
  */


  IroColor.kelvinToRgb = function kelvinToRgb (kelvin) {
    var temp = kelvin / 100;
    var r, g, b;

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
  };
  /**
   * @desc Convert an RGB color to an approximate kelvin temperature
   * @param kelvin - kelvin temperature
  */


  IroColor.rgbToKelvin = function rgbToKelvin (rgb) {
    var r = rgb.r;
      var b = rgb.b;
    var eps = 0.4;
    var minTemp = KELVIN_MIN;
    var maxTemp = KELVIN_MAX;
    var temp;

    while (maxTemp - minTemp > eps) {
      temp = (maxTemp + minTemp) * 0.5;
      var rgb$1 = IroColor.kelvinToRgb(temp);

      if (rgb$1.b / rgb$1.r >= b / r) {
        maxTemp = temp;
      } else {
        minTemp = temp;
      }
    }

    return temp;
  };

  prototypeAccessors.hsv.get = function () {
    // value is cloned to allow changes to be made to the values before passing them back
    var value = this.$;
    return {
      h: value.h,
      s: value.s,
      v: value.v
    };
  };

  prototypeAccessors.hsv.set = function (newValue) {
    var oldValue = this.$;
    newValue = Object.assign({}, oldValue,
      newValue); // If this Color is being watched for changes we need to compare the new and old values to check the difference
    // Otherwise we can just be lazy

    if (this.onChange) {
      // Compute changed values
      var changes = {
        h: false,
        v: false,
        s: false,
        a: false
      };

      for (var key in oldValue) {
        changes[key] = newValue[key] != oldValue[key];
      }

      this.$ = newValue; // If the value has changed, call hook callback

      if (changes.h || changes.s || changes.v || changes.a) { this.onChange(this, changes); }
    } else {
      this.$ = newValue;
    }
  };

  prototypeAccessors.hsva.get = function () {
    return Object.assign({}, this.$);
  };

  prototypeAccessors.hsva.set = function (value) {
    this.hsv = value;
  };

  prototypeAccessors.hue.get = function () {
    return this.$.h;
  };

  prototypeAccessors.hue.set = function (value) {
    this.hsv = {
      h: value
    };
  };

  prototypeAccessors.saturation.get = function () {
    return this.$.s;
  };

  prototypeAccessors.saturation.set = function (value) {
    this.hsv = {
      s: value
    };
  };

  prototypeAccessors.value.get = function () {
    return this.$.v;
  };

  prototypeAccessors.value.set = function (value) {
    this.hsv = {
      v: value
    };
  };

  prototypeAccessors.alpha.get = function () {
    return this.$.a;
  };

  prototypeAccessors.alpha.set = function (value) {
    this.hsv = Object.assign({}, this.hsv,
      {a: value});
  };

  prototypeAccessors.kelvin.get = function () {
    return IroColor.rgbToKelvin(this.rgb);
  };

  prototypeAccessors.kelvin.set = function (value) {
    this.rgb = IroColor.kelvinToRgb(value);
  };

  prototypeAccessors.red.get = function () {
    var rgb = this.rgb;
    return rgb.r;
  };

  prototypeAccessors.red.set = function (value) {
    this.rgb = Object.assign({}, this.rgb,
      {r: value});
  };

  prototypeAccessors.green.get = function () {
    var rgb = this.rgb;
    return rgb.g;
  };

  prototypeAccessors.green.set = function (value) {
    this.rgb = Object.assign({}, this.rgb,
      {g: value});
  };

  prototypeAccessors.blue.get = function () {
    var rgb = this.rgb;
    return rgb.b;
  };

  prototypeAccessors.blue.set = function (value) {
    this.rgb = Object.assign({}, this.rgb,
      {b: value});
  };

  prototypeAccessors.rgb.get = function () {
    var ref = IroColor.hsvToRgb(this.$);
      var r = ref.r;
      var g = ref.g;
      var b = ref.b;
    return {
      r: round(r),
      g: round(g),
      b: round(b)
    };
  };

  prototypeAccessors.rgb.set = function (value) {
    this.hsv = Object.assign({}, IroColor.rgbToHsv(value),
      {a: value.a === undefined ? 1 : value.a});
  };

  prototypeAccessors.rgba.get = function () {
    return Object.assign({}, this.rgb,
      {a: this.alpha});
  };

  prototypeAccessors.rgba.set = function (value) {
    this.rgb = value;
  };

  prototypeAccessors.hsl.get = function () {
    var ref = IroColor.hsvToHsl(this.$);
      var h = ref.h;
      var s = ref.s;
      var l = ref.l;
    return {
      h: round(h),
      s: round(s),
      l: round(l)
    };
  };

  prototypeAccessors.hsl.set = function (value) {
    this.hsv = Object.assign({}, IroColor.hslToHsv(value),
      {a: value.a === undefined ? 1 : value.a});
  };

  prototypeAccessors.hsla.get = function () {
    return Object.assign({}, this.hsl,
      {a: this.alpha});
  };

  prototypeAccessors.hsla.set = function (value) {
    this.hsl = value;
  };

  prototypeAccessors.rgbString.get = function () {
    var rgb = this.rgb;
    return ("rgb(" + (rgb.r) + ", " + (rgb.g) + ", " + (rgb.b) + ")");
  };

  prototypeAccessors.rgbString.set = function (value) {
    var match;
    var r,
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
        r: r,
        g: g,
        b: b,
        a: a
      };
    } else {
      throw new Error('Invalid rgb string');
    }
  };

  prototypeAccessors.rgbaString.get = function () {
    var rgba = this.rgba;
    return ("rgba(" + (rgba.r) + ", " + (rgba.g) + ", " + (rgba.b) + ", " + (rgba.a) + ")");
  };

  prototypeAccessors.rgbaString.set = function (value) {
    this.rgbString = value;
  };

  prototypeAccessors.hexString.get = function () {
    var rgb = this.rgb;
    return ("#" + (intToHex(rgb.r)) + (intToHex(rgb.g)) + (intToHex(rgb.b)));
  };

  prototypeAccessors.hexString.set = function (value) {
    var match;
    var r,
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
        r: r,
        g: g,
        b: b,
        a: a / 255
      };
    } else {
      throw new Error('Invalid hex string');
    }
  };

  prototypeAccessors.hex8String.get = function () {
    var rgba = this.rgba;
    return ("#" + (intToHex(rgba.r)) + (intToHex(rgba.g)) + (intToHex(rgba.b)) + (intToHex(floor(rgba.a * 255))));
  };

  prototypeAccessors.hex8String.set = function (value) {
    this.hexString = value;
  };

  prototypeAccessors.hslString.get = function () {
    var hsl = this.hsl;
    return ("hsl(" + (hsl.h) + ", " + (hsl.s) + "%, " + (hsl.l) + "%)");
  };

  prototypeAccessors.hslString.set = function (value) {
    var match;
    var h,
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
        h: h,
        s: s,
        l: l,
        a: a
      };
    } else {
      throw new Error('Invalid hsl string');
    }
  };

  prototypeAccessors.hslaString.get = function () {
    var hsla = this.hsla;
    return ("hsl(" + (hsla.h) + ", " + (hsla.s) + "%, " + (hsla.l) + "%, " + (hsla.a) + ")");
  };

  prototypeAccessors.hslaString.set = function (value) {
    this.hslString = value;
  };

  Object.defineProperties( IroColor.prototype, prototypeAccessors );

  var sliderDefaultOptions = {
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
    var obj;

    return ( obj = {}, obj[props.layoutDirection === 'horizontal' ? 'marginLeft' : 'marginTop'] = props.sliderMargin, obj );
  }
  /**
   * @desc Get the bounding dimensions of the slider
   * @param props - slider props
   */

  function getSliderDimensions(props) {
    var width = props.width;
    var sliderSize = props.sliderSize;
    var borderWidth = props.borderWidth;
    var handleRadius = props.handleRadius;
    var padding = props.padding;
    var sliderShape = props.sliderShape;
    var ishorizontal = props.layoutDirection === 'horizontal'; // automatically calculate sliderSize if its not defined

    sliderSize = sliderSize ? sliderSize : padding * 2 + handleRadius * 2 + borderWidth * 2;

    if (sliderShape === 'circle') {
      return {
        handleStart: props.padding + props.handleRadius,
        handleRange: width - padding * 2 - handleRadius * 2 - borderWidth * 2,
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
    var hsva = color.hsva;
    var rgb = color.rgb;

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
        var minTemperature = props.minTemperature;
    var maxTemperature = props.maxTemperature;
        var temperatureRange = maxTemperature - minTemperature;
        var percent = (color.kelvin - minTemperature) / temperatureRange * 100; // clmap percentage

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
    var ref = getSliderDimensions(props);
    var handleRange = ref.handleRange;
    var handleStart = ref.handleStart;
    var handlePos;

    if (props.layoutDirection === 'horizontal') {
      handlePos = -1 * y + handleRange + handleStart;
    } else {
      handlePos = x - handleStart;
    } // clamp handle position


    handlePos = Math.max(Math.min(handlePos, handleRange), 0);
    var percent = Math.round(100 / handleRange * handlePos);

    switch (props.sliderType) {
      case 'kelvin':
        var minTemperature = props.minTemperature;
    var maxTemperature = props.maxTemperature;
        var temperatureRange = maxTemperature - minTemperature;
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
    var ref = getSliderDimensions(props);
    var width = ref.width;
    var height = ref.height;
    var handleRange = ref.handleRange;
    var handleStart = ref.handleStart;
    var ishorizontal = props.layoutDirection === 'horizontal';
    var sliderValue = getCurrentSliderValue(props, color);
    var midPoint = ishorizontal ? width / 2 : height / 2;
    var handlePos = handleStart + sliderValue / 100 * handleRange;

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
    var hsv = color.hsv;
    var rgb = color.rgb;

    switch (props.sliderType) {
      case 'red':
        return [[0, ("rgb(" + (0) + "," + (rgb.g) + "," + (rgb.b) + ")")], [100, ("rgb(" + (255) + "," + (rgb.g) + "," + (rgb.b) + ")")]];

      case 'green':
        return [[0, ("rgb(" + (rgb.r) + "," + (0) + "," + (rgb.b) + ")")], [100, ("rgb(" + (rgb.r) + "," + (255) + "," + (rgb.b) + ")")]];

      case 'blue':
        return [[0, ("rgb(" + (rgb.r) + "," + (rgb.g) + "," + (0) + ")")], [100, ("rgb(" + (rgb.r) + "," + (rgb.g) + "," + (255) + ")")]];

      case 'alpha':
        return [[0, ("rgba(" + (rgb.r) + "," + (rgb.g) + "," + (rgb.b) + ",0)")], [100, ("rgb(" + (rgb.r) + "," + (rgb.g) + "," + (rgb.b) + ")")]];

      case 'kelvin':
        var stops = [];
        var min = props.minTemperature;
        var max = props.maxTemperature;
        var numStops = 8;
        var range = max - min;

        for (var kelvin = min, stop = 0; kelvin < max; kelvin += range / numStops, stop += 1) {
          var ref = IroColor.kelvinToRgb(kelvin);
          var r = ref.r;
          var g = ref.g;
          var b = ref.b;
          stops.push([100 / numStops * stop, ("rgb(" + r + "," + g + "," + b + ")")]);
        }

        return stops;

      case 'hue':
        return [[0, '#f00'], [16.666, '#ff0'], [33.333, '#0f0'], [50, '#0ff'], [66.666, '#00f'], [83.333, '#f0f'], [100, '#f00']];

      case 'saturation':
        var noSat = IroColor.hsvToHsl({
          h: hsv.h,
          s: 0,
          v: hsv.v
        });
        var fullSat = IroColor.hsvToHsl({
          h: hsv.h,
          s: 100,
          v: hsv.v
        });
        return [[0, ("hsl(" + (noSat.h) + "," + (noSat.s) + "%," + (noSat.l) + "%)")], [100, ("hsl(" + (fullSat.h) + "," + (fullSat.s) + "%," + (fullSat.l) + "%)")]];

      case 'value':
      default:
        var hsl = IroColor.hsvToHsl({
          h: hsv.h,
          s: hsv.s,
          v: 100
        });
        return [[0, '#000'], [100, ("hsl(" + (hsl.h) + "," + (hsl.s) + "%," + (hsl.l) + "%)")]];
    }
  }
  /**
   * @desc Get the gradient coords for a slider
   * @param props - slider props
   */

  function getSliderGradientCoords(props) {
    var ishorizontal = props.layoutDirection === 'horizontal';
    return {
      x1: '0%',
      y1: ishorizontal ? '100%' : '0%',
      x2: ishorizontal ? '0%' : '100%',
      y2: '0%'
    };
  }

  /**
   * @desc Get the point as the center of the wheel
   * @param props - wheel props
   */
  function getWheelDimensions(props) {
    var rad = props.width / 2;
    return {
      width: props.width,
      radius: rad - props.borderWidth,
      cx: rad,
      cy: rad
    };
  }
  /**
   * @desc Translate an angle according to wheelAngle and wheelDirection
   * @param props - wheel props
   * @param angle - input angle
   */

  function translateWheelAngle(props, angle, invert) {
    var wheelAngle = props.wheelAngle;
    var wheelDirection = props.wheelDirection;

    if (!invert && wheelDirection === 'clockwise' || invert && wheelDirection === 'anticlockwise') {
      angle = (invert ? 180 : 360) - (wheelAngle - angle);
    } else {
      angle = wheelAngle + angle;
    } // javascript's modulo operator doesn't produce positive numbers with negative input
    // https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e


    return (angle % 360 + 360) % 360;
  }
  /**
   * @desc Get the current handle position for a given color
   * @param props - wheel props
   * @param color
   */

  function getWheelHandlePosition(props, color) {
    var hsv = color.hsv;
    var ref = getWheelDimensions(props);
    var cx = ref.cx;
    var cy = ref.cy;
    var handleRange = props.width / 2 - props.padding - props.handleRadius - props.borderWidth;
    var handleAngle = (180 + translateWheelAngle(props, hsv.h, true)) * (Math.PI / 180);
    var handleDist = hsv.s / 100 * handleRange;
    var direction = props.wheelDirection === 'clockwise' ? -1 : 1;
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
    var ref = getWheelDimensions(props);
    var cx = ref.cx;
    var cy = ref.cy;
    var handleRange = props.width / 2 - props.padding - props.handleRadius - props.borderWidth;
    x = cx - x;
    y = cy - y; // Calculate the hue by converting the angle to radians

    var hue = translateWheelAngle(props, Math.atan2(-y, -x) * (180 / Math.PI)); // Find the point's distance from the center of the wheel
    // This is used to show the saturation level

    var handleDist = Math.min(Math.sqrt(x * x + y * y), handleRange);
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
    var obj;

    return ( obj = {}, obj[props.layoutDirection === 'horizontal' ? 'marginLeft' : 'marginTop'] = props.sliderMargin, obj );
  }
  /**
   * @desc Get the bounding dimensions of the box
   * @param props - box props
   */

  function getBoxDimensions(props) {
    var width = props.width;
    var padding = props.padding;
    var handleRadius = props.handleRadius;
    return {
      width: width,
      height: width,
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
    var ref = getBoxDimensions(props);
    var width = ref.width;
    var height = ref.height;
    var radius = ref.radius;
    var handleStart = radius;
    var handleRangeX = width - radius * 2;
    var handleRangeY = height - radius * 2;
    var percentX = (x - handleStart) / handleRangeX * 100;
    var percentY = (y - handleStart) / handleRangeY * 100;
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
    var ref = getBoxDimensions(props);
    var width = ref.width;
    var height = ref.height;
    var radius = ref.radius;
    var hsv = color.hsv;
    var handleStart = radius;
    var handleRangeX = width - radius * 2;
    var handleRangeY = height - radius * 2;
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
    var hue = color.hue;
    return [// saturation gradient
    [[0, '#fff'], [100, ("hsl(" + hue + ",100%,50%)")]], // lightness gradient
    [[0, 'rgba(0,0,0,0)'], [100, '#000']]];
  }

  // Keep track of html <base> elements for resolveSvgUrl
  // getElementsByTagName returns a live HTMLCollection, which stays in sync with the DOM tree
  // So it only needs to be called once
  var BASE_ELEMENTS;
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
    if (!BASE_ELEMENTS) { BASE_ELEMENTS = document.getElementsByTagName('base'); } // Sniff useragent string to check if the user is running Safari

    var ua = window.navigator.userAgent;
    var isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    var isIos = /iPhone|iPod|iPad/i.test(ua);
    var location = window.location;
    return (isSafari || isIos) && BASE_ELEMENTS.length > 0 ? ((location.protocol) + "//" + (location.host) + (location.pathname) + (location.search) + url) : url;
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
    var largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    startAngle *= Math.PI / 180;
    endAngle *= Math.PI / 180;
    var x1 = cx + radius * Math.cos(endAngle);
    var y1 = cy + radius * Math.sin(endAngle);
    var x2 = cx + radius * Math.cos(startAngle);
    var y2 = cy + radius * Math.sin(startAngle);
    return ("M " + x1 + " " + y1 + " A " + radius + " " + radius + " 0 " + largeArcFlag + " 0 " + x2 + " " + y2);
  }
  /**
   * @desc Given a specifc (x, y) position, test if there's a handle there and return its index, else return null.
   *       This is used for components like the box and wheel which support multiple handles when multicolor is active
   * @props x - point x position
   * @props y - point y position
   * @props handlePositions - array of {x, y} coords for each handle
   */

  function getHandleAtPoint(props, x, y, handlePositions) {
    for (var i = 0; i < handlePositions.length; i++) {
      var dX = handlePositions[i].x - x;
      var dY = handlePositions[i].y - y;
      var dist = Math.sqrt(dX * dX + dY * dY);

      if (dist < props.handleRadius) {
        return i;
      }
    }

    return null;
  }

  var iroColorPickerOptionDefaults = {
    width: 300,
    height: 300,
    handleRadius: 8,
    handleSvg: null,
    handleProps: {
      x: 0,
      y: 0
    },
    color: '#fff',
    colors: [],
    borderColor: '#fff',
    borderWidth: 0,
    wheelLightness: true,
    wheelAngle: 0,
    wheelDirection: 'anticlockwise',
    layoutDirection: 'vertical',
    sliderSize: null,
    sliderMargin: 12,
    padding: 6
  };

  exports.IroColor = IroColor;
  exports.sliderDefaultOptions = sliderDefaultOptions;
  exports.getSliderStyles = getSliderStyles;
  exports.getSliderDimensions = getSliderDimensions;
  exports.getCurrentSliderValue = getCurrentSliderValue;
  exports.getSliderValueFromInput = getSliderValueFromInput;
  exports.getSliderHandlePosition = getSliderHandlePosition;
  exports.getSliderGradient = getSliderGradient;
  exports.getSliderGradientCoords = getSliderGradientCoords;
  exports.getWheelDimensions = getWheelDimensions;
  exports.translateWheelAngle = translateWheelAngle;
  exports.getWheelHandlePosition = getWheelHandlePosition;
  exports.getWheelValueFromInput = getWheelValueFromInput;
  exports.getBoxStyles = getBoxStyles;
  exports.getBoxDimensions = getBoxDimensions;
  exports.getBoxValueFromInput = getBoxValueFromInput;
  exports.getBoxHandlePosition = getBoxHandlePosition;
  exports.getBoxGradients = getBoxGradients;
  exports.resolveSvgUrl = resolveSvgUrl;
  exports.getSvgArcPath = getSvgArcPath;
  exports.getHandleAtPoint = getHandleAtPoint;
  exports.iroColorPickerOptionDefaults = iroColorPickerOptionDefaults;

})));
//# sourceMappingURL=iro-core.umd.js.map
