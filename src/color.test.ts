import { IroColor }  from './color';

const roundObject = (obj) => Object.keys(obj).reduce((result, key) => {
  result[key] = Math.round(obj[key]);
  return result;
}, {});

describe('Color conversion', () => {
  test('Color.rgbToHsv accurately converts rgb to hsv', () => {
    // Pure white
    expect(IroColor.rgbToHsv({r: 255, g: 255, b: 255})).toMatchObject({h: 0, s: 0, v: 100});
    // Pure black
    expect(IroColor.rgbToHsv({r: 0, g: 0, b: 0})).toMatchObject({h: 0, s: 0, v: 0});
    // Pure red
    expect(IroColor.rgbToHsv({r: 255, g: 0, b: 0})).toMatchObject({h: 0, s: 100, v: 100});
    // Pure yellow
    expect(IroColor.rgbToHsv({r: 255, g: 255, b: 0})).toMatchObject({h: 60, s: 100, v: 100});
    // Pure green
    expect(IroColor.rgbToHsv({r: 0, g: 255, b: 0})).toMatchObject({h: 120, s: 100, v: 100});
    // Pure cyan
    expect(IroColor.rgbToHsv({r: 0, g: 255, b: 255})).toMatchObject({h: 180, s: 100, v: 100});
    // Pure blue
    expect(IroColor.rgbToHsv({r: 0, g: 0, b: 255})).toMatchObject({h: 240, s: 100, v: 100});
    // Pure magenta
    expect(IroColor.rgbToHsv({r: 255, g: 0, b: 255})).toMatchObject({h: 300, s: 100, v: 100});
  });

  test('Color.hsvToRgb accurately converts hsv to rgb', () => {
    // Pure white
    expect(IroColor.hsvToRgb({h: 0, s: 0, v: 100})).toMatchObject({r: 255, g: 255, b: 255});
    // Pure black
    expect(IroColor.hsvToRgb({h: 0, s: 0, v: 0})).toMatchObject({r: 0, g: 0, b: 0});
    // Pure red
    expect(IroColor.hsvToRgb({h: 0, s: 100, v: 100})).toMatchObject({r: 255, g: 0, b: 0});
    // Pure yellow
    expect(IroColor.hsvToRgb({h: 60, s: 100, v: 100})).toMatchObject({r: 255, g: 255, b: 0});
    // Pure green
    expect(IroColor.hsvToRgb({h: 120, s: 100, v: 100})).toMatchObject({r: 0, g: 255, b: 0});
    // Pure cyan
    expect(IroColor.hsvToRgb({h: 180, s: 100, v: 100})).toMatchObject({r: 0, g: 255, b: 255});
    // Pure blue
    expect(IroColor.hsvToRgb({h: 240, s: 100, v: 100})).toMatchObject({r: 0, g: 0, b: 255});
    // Pure magenta
    expect(IroColor.hsvToRgb({h: 300, s: 100, v: 100})).toMatchObject({r: 255, g: 0, b: 255});
  });

  test('Color.hslToHsv accurately converts hsl to hsv', () => {
    // Pure white
    expect(IroColor.hslToHsv({h: 0, s: 0, l: 100})).toMatchObject({h: 0, s: 0, v: 100});
    // Pure black
    expect(IroColor.hslToHsv({h: 0, s: 0, l: 0})).toMatchObject({h: 0, s: 0, v: 0});
    // 25% s 25% l
    expect(IroColor.hslToHsv({h: 0, s: 25, l: 25})).toMatchObject({h: 0, s: 40, v: 31.25});
    // 50% s 50% l
    expect(roundObject(IroColor.hslToHsv({h: 0, s: 50, l: 50}))).toMatchObject({h: 0, s: 67, v: 75});
    // 75% s 75% l
    expect(IroColor.hslToHsv({h: 0, s: 75, l: 75})).toMatchObject({h: 0, s: 40, v: 93.75});
  });

  test('Color.hsvToHsl accurately converts hsv to hsl', () => {
    // Pure white
    expect(IroColor.hsvToHsl({h: 0, s: 0, v: 100})).toMatchObject({h: 0, s: 0, l: 100});
    // Pure black
    expect(IroColor.hsvToHsl({h: 0, s: 0, v: 0})).toMatchObject({h: 0, s: 0, l: 0});
    // 25% s 25% l
    expect(IroColor.hsvToHsl({h: 0, s: 40, v: 31.25})).toMatchObject({h: 0, s: 25, l: 25});
    // 50% s 50% l
    expect(roundObject(IroColor.hsvToHsl({h: 0, s: 67, v: 75}))).toMatchObject({h: 0, s: 50, l: 50});
    // 75% s 75% l
    expect(IroColor.hsvToHsl({h: 0, s: 40, v: 93.75})).toMatchObject({h: 0, s: 75, l: 75});
  });

  test('Color.kelvinToRgb accurately converts kelvin temperature to rgb', () => {
    expect(IroColor.kelvinToRgb(3000)).toMatchObject({r: 255, g: 180, b: 108});
    expect(IroColor.kelvinToRgb(6500)).toMatchObject({r: 255, g: 249, b: 254});
    expect(IroColor.kelvinToRgb(12000)).toMatchObject({r: 191, g: 211, b: 255});
    expect(IroColor.kelvinToRgb(18000)).toMatchObject({r: 171, g: 199, b: 255});
    expect(IroColor.kelvinToRgb(24000)).toMatchObject({r: 162, g: 193, b: 255});
    expect(IroColor.kelvinToRgb(30000)).toMatchObject({r: 158, g: 190, b: 255});
    expect(IroColor.kelvinToRgb(36000)).toMatchObject({r: 156, g: 188, b: 255});
  });

  test('Color.rgbToKelvin accurately converts kelvin temperature to rgb', () => {
    expect(Math.round(IroColor.rgbToKelvin({r: 156, g: 188, b: 255}))).toEqual(33972);
    expect(Math.round(IroColor.rgbToKelvin({r: 158, g: 190, b: 255}))).toEqual(29083);
    expect(Math.round(IroColor.rgbToKelvin({r: 191, g: 211, b: 255}))).toEqual(11876);
    expect(Math.round(IroColor.rgbToKelvin({r: 255, g: 249, b: 254}))).toEqual(6489);
  });
});

describe('Color constructor', () => {
  test('Color is a constructor', () => {
    expect(!!IroColor.prototype && !!IroColor.prototype.constructor.name).toBeTruthy();
  });

  test('Color can be constructed with a hsv object', () => {
    var hsv = { h: 360, s: 100, v: 50 };
    var color = new IroColor(hsv);
    expect(color.hsv).toMatchObject(hsv);
  });

  test('Color can be constructed with an rgb object', () => {
    var color = new IroColor({r: 255, g: 255, b: 255});
    expect(color.hsv).toMatchObject({h: 0, s: 0, v: 100});
  });

  test('Color can be constructed with a hsl object', () => {
    var color = new IroColor({h: 0, s: 0, l: 100});
    expect(color.hsv).toMatchObject({h: 0, s: 0, v: 100});
  });

  test('Color can be constructed with an rgb or rgba string', () => {
    var color = new IroColor('rgb(255, 0, 0)');
    expect(color.rgb).toMatchObject({r: 255, g: 0, b: 0});
    var color = new IroColor('rgb(0, 255, 0)');
    expect(color.rgb).toMatchObject({r: 0, g: 255, b: 0});
    var color = new IroColor('rgb(0, 0, 255)');
    expect(color.rgb).toMatchObject({r: 0, g: 0, b: 255});
    var color = new IroColor('rgb(255,255,255)');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('rgb 255 255 255');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('rgba(255, 0, 0, 1)');
    expect(color.rgb).toMatchObject({r: 255, g: 0, b: 0});
    var color = new IroColor('rgba(0, 255, 0, 1)');
    expect(color.rgb).toMatchObject({r: 0, g: 255, b: 0});
    var color = new IroColor('rgba(0, 0, 255, 1)');
    expect(color.rgb).toMatchObject({r: 0, g: 0, b: 255});
    var color = new IroColor('rgba(255,255,255,1)');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('rgba 255 255 255 1');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
  });

  test('Color can be constructed with an rgb or rgba percentage string', () => {
    var color = new IroColor('rgb(100%, 0%, 0%)');
    expect(color.rgb).toMatchObject({r: 255, g: 0, b: 0});
    var color = new IroColor('rgb(0%, 100%, 0%)');
    expect(color.rgb).toMatchObject({r: 0, g: 255, b: 0});
    var color = new IroColor('rgb(0%, 0%, 100%)');
    expect(color.rgb).toMatchObject({r: 0, g: 0, b: 255});
    var color = new IroColor('rgb(100%, 100%, 100%)');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('rgb(100%,100%,100%)');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('rgb 100% 100% 100%');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('rgba(100%, 100%, 100%, 100%)');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('rgba(100%,100%,100%,100%)');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('rgba 100% 100% 100% 100%');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
  });

  test('Color alpha component can be set with an rgba or rgba percentage string', () => {
    var color = new IroColor('rgba(255, 255, 255, 0)');
    expect(color.alpha).toEqual(0);
    var color = new IroColor('rgba(255, 255, 255, 1)');
    expect(color.alpha).toEqual(1);
    var color = new IroColor('rgba(255, 255, 255, .5)');
    expect(color.alpha).toEqual(0.5);
    var color = new IroColor('rgba(255, 255, 255, 0.5)');
    expect(color.alpha).toEqual(0.5);
    var color = new IroColor('rgba(100%, 100%, 100%, 0%)');
    expect(color.alpha).toEqual(0);
    var color = new IroColor('rgba(100%, 100%, 100%, 100%)');
    expect(color.alpha).toEqual(1);
    var color = new IroColor('rgba(100%, 100%, 100%, 50%)');
    expect(color.alpha).toEqual(0.5);
    var color = new IroColor('rgba(100%, 100%, 100%, 50.0%)');
    expect(color.alpha).toEqual(0.5);
  });

  test('Color can be constructed with an hsl or hsla string', () => {
    var color = new IroColor('hsl(360, 0%, 100%)');
    expect(color.hsl).toMatchObject({h: 360, s: 0, l: 100});
    var color = new IroColor('hsl(360,100%,100%)');
    expect(color.hsl).toMatchObject({h: 360, s: 0, l: 100});
    var color = new IroColor('hsl 360 100% 100%');
    expect(color.hsl).toMatchObject({h: 360, s: 0, l: 100});
    var color = new IroColor('hsla(360, 100%, 100%, 1)');
    expect(color.hsl).toMatchObject({h: 360, s: 0, l: 100});
    var color = new IroColor('hsla(360,100%,100%,1)');
    expect(color.hsl).toMatchObject({h: 360, s: 0, l: 100});
    var color = new IroColor('hsla 360 100% 100% 1');
    expect(color.hsl).toMatchObject({h: 360, s: 0, l: 100});
  });

  test('Color alpha component can be set with a hsla string', () => {
    var color = new IroColor('hsla(360, 100%, 100%, 0)');
    expect(color.alpha).toEqual(0);
    var color = new IroColor('hsla(360, 100%, 100%, 1)');
    expect(color.alpha).toEqual(1);
    var color = new IroColor('hsla(360, 100%, 100%, .5)');
    expect(color.alpha).toEqual(0.5);
    var color = new IroColor('hsla(360, 100%, 100%, 0.5)');
    expect(color.alpha).toEqual(0.5);
    var color = new IroColor('hsla(100%, 100%, 100%, 0%)');
    expect(color.alpha).toEqual(0);
    var color = new IroColor('hsla(100%, 100%, 100%, 100%)');
    expect(color.alpha).toEqual(1);
    var color = new IroColor('hsla(100%, 100%, 100%, 50%)');
    expect(color.alpha).toEqual(0.5);
    var color = new IroColor('hsla(100%, 100%, 100%, 50.0%)');
    expect(color.alpha).toEqual(0.5);
  });

  test('Color can be constructed with a hex3 value', () => {
    var color = new IroColor('#f00');
    expect(color.rgb).toMatchObject({r: 255, g: 0, b: 0});
    var color = new IroColor('#0f0');
    expect(color.rgb).toMatchObject({r: 0, g: 255, b: 0});
    var color = new IroColor('#00f');
    expect(color.rgb).toMatchObject({r: 0, g: 0, b: 255});
    var color = new IroColor('#fff');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('#FFF');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('fff');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('0xfff');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('0xFFF');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
  });

  test('Color can be constructed with a hex4 value', () => {
    var color = new IroColor('#f000');
    expect(color.rgb).toMatchObject({r: 255, g: 0, b: 0});
    var color = new IroColor('#0f00');
    expect(color.rgb).toMatchObject({r: 0, g: 255, b: 0});
    var color = new IroColor('#00f0');
    expect(color.rgb).toMatchObject({r: 0, g: 0, b: 255});
    var color = new IroColor('#000f');
    expect(color.rgb).toMatchObject({r: 0, g: 0, b: 0});
    var color = new IroColor('#ffff');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('#ffff');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('#FFFF');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('ffff');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('0xffff');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('0xFFFF');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
  });

  test('Color can be constructed with a hex6 value', () => {
    var color = new IroColor('#ff0000');
    expect(color.rgb).toMatchObject({r: 255, g: 0, b: 0});
    var color = new IroColor('#00ff00');
    expect(color.rgb).toMatchObject({r: 0, g: 255, b: 0});
    var color = new IroColor('#0000ff');
    expect(color.rgb).toMatchObject({r: 0, g: 0, b: 255});
    var color = new IroColor('#ffffff');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('#FFFFFF');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('ffffff');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('FFFFFF');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('0xffffff');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('0xFFFFFF');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
  });

  test('Color can be constructed with a hex8 value', () => {
    var color = new IroColor('#ff000000');
    expect(color.rgb).toMatchObject({r: 255, g: 0, b: 0});
    var color = new IroColor('#00ff0000');
    expect(color.rgb).toMatchObject({r: 0, g: 255, b: 0});
    var color = new IroColor('#0000ff00');
    expect(color.rgb).toMatchObject({r: 0, g: 0, b: 255});
    var color = new IroColor('#000000ff');
    expect(color.rgb).toMatchObject({r: 0, g: 0, b: 0});
    var color = new IroColor('#ffffffff');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('#FFFFFFFF');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('ffffffff');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('FFFFFFFF');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('0xffffffff');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    var color = new IroColor('0xFFFFFFFF');
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
  });
});

describe('Color properties', () => {
  test('Color hsv property is readable', () => {
    const hsv = { h: 360, s: 100, v: 50 };
    const color = new IroColor(hsv);
    expect(color.hsv).toMatchObject(hsv);
  });

  test('Color hsv property is writable', () => {
    const hsv = { h: 360, s: 100, v: 50 };
    const color = new IroColor();
    color.hsv = hsv;
    expect(color.hsv).toMatchObject(hsv);
  });

  test('Color alpha property is readable', () => {
    const hsv = { h: 360, s: 100, v: 50, a: .5 };
    const color = new IroColor(hsv);
    expect(color.alpha).toEqual(hsv.a);
  });

  test('Color alpha property is writable', () => {
    const hsv = { h: 360, s: 100, v: 50, a: .5 };
    const color = new IroColor(hsv);
    expect(color.alpha).toEqual(hsv.a);
  });

  test('Color kelvin property is readable', () => {
    const hsv = { h: 360, s: 100, v: 50, a: .5 };
    const color = new IroColor(hsv);
    expect(color.kelvin).toBeGreaterThan(0);
  });

  test('Color kelvin property is writable', () => {
    const hsv = { h: 360, s: 100, v: 50, a: .5 };
    const color = new IroColor(hsv);
    color.kelvin = 6600;
    expect(color.hsv).not.toEqual(hsv);
  });

  test('Color rgb property is readable', () => {
    const color = new IroColor({ h: 360, s: 100, v: 50 });
    expect(color.rgb).toMatchObject({r: 128, g: 0, b: 0});
  });

  test('Color rgb property is writable', () => {
    const color = new IroColor({h: 0, s: 0, v: 0, a: 0});
    color.rgb = {r: 128, g: 0, b: 0};
    expect(roundObject(color.hsv)).toMatchObject({ h: 0, s: 100, v: 50 });
  });

  test('Color hsl property is readable', () => {
    const color = new IroColor({ h: 360, s: 100, v: 50 });
    expect(color.hsl).toMatchObject({h: 360, s: 100, l: 25});
  });

  test('Color hsl property is writable', () => {
    const color = new IroColor({h: 0, s: 0, v: 0, a: 0});
    color.hsl = {h: 360, s: 100, l: 100};
    expect(roundObject(color.hsv)).toMatchObject({ h: 360, s: 0, v: 100 });
  });

  test('Color rgbString property is readable', () => {
    const color = new IroColor({ h: 360, s: 100, v: 50 });
    expect(color.rgbString).toBe('rgb(128, 0, 0)');
  });

  test('Color rgbString property is writable', () => {
    const color = new IroColor({h: 0, s: 0, v: 0, a: 0});
    color.rgbString = 'rgb(128, 0, 0)';
    expect(roundObject(color.hsv)).toMatchObject({ h: 0, s: 100, v: 50 });
  });

  test('Color hslString property is readable', () => {
    const color = new IroColor({ h: 360, s: 100, v: 50 });
    expect(color.hslString).toBe('hsl(360, 100%, 25%)');
  });

  test('Color hslString property is writable', () => {
    const color = new IroColor({h: 0, s: 0, v: 0, a: 0});
    color.hslString = 'hsl(360, 100%, 25%)';
    expect(roundObject(color.hsv)).toMatchObject({ h: 360, s: 100, v: 50 });
  });

  test('Color hexString property is readable', () => {
    const color = new IroColor({r: 255, g: 0, b: 0});
    expect(color.hexString).toBe('#ff0000');
  });

  test('Color hexString property is writable', () => {
    const color = new IroColor({h: 0, s: 0, v: 0, a: 0});
    color.hexString = '#ff0000';
    expect(roundObject(color.rgb)).toMatchObject({r: 255, g: 0, b: 0});
  });
});

describe('Color methods', () => {
  test('Color clone method returns a new color with the same value', () => {
    const color = new IroColor({h: 0, s: 100, v: 100, a: 1});
    const cloneColor = color.clone();
    expect(color.hsv).toMatchObject(cloneColor.hsv);
  });

  test('Color reset method successfully resets the color to its initial value', () => {
    const color = new IroColor('#f00');
    color.hexString = '#fff';
    expect(color.rgb).toMatchObject({r: 255, g: 255, b: 255});
    color.reset();
    expect(color.rgb).toMatchObject({r: 255, g: 0, b: 0});
  });

  test('Color unbind method clears the onChange callback', () => {
    const mockCallback = jest.fn();
    const color = new IroColor('#f00', mockCallback);
    color.unbind();
    color.hexString = '#fff';
    expect(mockCallback).not.toHaveBeenCalled();
  });

  // set() is also used internally by the iro.Color parser, 
  // so the constructor tests already make that this method parses different colors properly
  test('Color set method successfully updates the color value', () => {
    const color = new IroColor({h: 0, s: 100, v: 100, a: 1});
    color.set({h: 360, s: 0, v: 0, a: 0});
    expect(color.hsv).toMatchObject({h: 360, s: 0, v: 0});
  });

  test('Color setChannel method successfully sets hsv channels', () => {
    var color = new IroColor({h: 0, s: 0, v: 0, a: 0});
    color.setChannel('hsv', 'h', 360);
    expect(color.hsv).toMatchObject({h: 360, s: 0, v: 0});

    var color = new IroColor({h: 0, s: 0, v: 0, a: 0});
    color.setChannel('hsv', 's', 100);
    expect(color.hsv).toMatchObject({h: 0, s: 100, v: 0});

    var color = new IroColor({h: 0, s: 0, v: 0, a: 0});
    color.setChannel('hsv', 'v', 100);
    expect(color.hsv).toMatchObject({h: 0, s: 0, v: 100});
  });

  test('Color setChannel method successfully sets rgb channels', () => {
    var color = new IroColor({r: 0, g: 0, b: 0});
    color.setChannel('rgb', 'r', 255);
    expect(color.rgb).toMatchObject({r: 255, g: 0, b: 0});

    var color = new IroColor({r: 0, g: 0, b: 0});
    color.setChannel('rgb', 'g', 255);
    expect(color.rgb).toMatchObject({r: 0, g: 255, b: 0});

    var color = new IroColor({r: 0, g: 0, b: 0});
    color.setChannel('rgb', 'b', 255);
    expect(color.rgb).toMatchObject({r: 0, g: 0, b: 255});
  });
});

describe('Color change callback', () => {
  test('Color accepts and fires onChange callback', done => {
    const color = new IroColor({ h: 360, s: 100, v: 100, a: 1 }, () => {
      done();
    });
    color.hsv = { h: 0, s: 0, v: 0, a: 0 };
  });

  test('Color onChange callback receives color and changes params', done => {
    const color = new IroColor({ h: 360, s: 100, v: 100, a: 1 }, (callbackColor, changes) => {
      expect(callbackColor).toBe(color);
      expect(('h' in changes) && ('s' in changes) && ('v' in changes) && ('a' in changes)).toBeTruthy();
      done();
    });
    color.hsv = { h: 0, s: 0, v: 0, a: 0 };
  });

  test('Color onChange changes param provides an accurate diff of color changes', done => {
    const color = new IroColor({ h: 360, s: 100, v: 100, a: 1 }, (color, changes) => {
      // all hsva channels should have changed
      expect(changes).toMatchObject({
        h: true,
        s: true,
        v: true,
        a: true
      });
      done();
    });
    color.hsv = { h: 0, s: 0, v: 0, a: 0 };
  });
});
