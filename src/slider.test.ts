import { 
  getSliderDimensions,
  getCurrentSliderValue,
  getSliderValueFromInput,
  getSliderGradient,
  getSliderHandlePosition
} from './slider';
import { IroColor } from './color';

describe('getSliderDimensions', () => {

  test('getSliderDimensions returns correct dimensions', () => {
    expect(getSliderDimensions({
      layoutDirection: 'vertical',
      width: 300,
      sliderSize: 30,
      borderWidth: 0,
      handleRadius: 8
    })).toMatchObject({
      width: 300,
      height: 30,
      radius: 15
    });
  });

  test('getSliderDimensions handles borderWidth', () => {
    expect(getSliderDimensions({
      layoutDirection: 'vertical',
      width: 300,
      sliderSize: 30,
      borderWidth: 2,
      handleRadius: 8,
      padding: 8
    })).toMatchObject({
      width: 300,
      height: 30,
      radius: 15
    });
  });

  test('getSliderDimensions handles sliderHeight being undefined', () => {
    expect(getSliderDimensions({
      layoutDirection: 'vertical',
      width: 300,
      sliderSize: undefined,
      borderWidth: 2,
      handleRadius: 8,
      padding: 8
    })).toMatchObject({
      width: 300,
      height: 36,
      radius: 18
    });
  });

});

describe('getCurrentSliderValue', () => {

  test('getCurrentSliderValue handles hue type slider', () => {
    expect(getCurrentSliderValue({
      layoutDirection: 'vertical',
      sliderType: 'hue'
    }, new IroColor({h: 0, s: 100, v: 0}))).toBe(0);
    expect(getCurrentSliderValue({
      layoutDirection: 'vertical',
      sliderType: 'hue'
    }, new IroColor({h: 180, s: 100, v: 0}))).toBe(50);
    expect(getCurrentSliderValue({
      layoutDirection: 'vertical',
      sliderType: 'hue'
    }, new IroColor({h: 360, s: 100, v: 0}))).toBe(100);
  });

  test('getCurrentSliderValue handles saturation type slider', () => {
    expect(getCurrentSliderValue({
      layoutDirection: 'vertical',
      sliderType: 'saturation'
    }, new IroColor({h: 300, s: 0, v: 0}))).toBe(0);
    expect(getCurrentSliderValue({
      layoutDirection: 'vertical',
      sliderType: 'saturation'
    }, new IroColor({h: 300, s: 50, v: 0}))).toBe(50);
    expect(getCurrentSliderValue({
      layoutDirection: 'vertical',
      sliderType: 'saturation'
    }, new IroColor({h: 300, s: 100, v: 0}))).toBe(100);
  });

  test('getCurrentSliderValue handles value type slider', () => {
    expect(getCurrentSliderValue({
      layoutDirection: 'vertical',
      sliderType: 'value'
    }, new IroColor({h: 300, s: 100, v: 0}))).toBe(0);
    expect(getCurrentSliderValue({
      layoutDirection: 'vertical',
      sliderType: 'value'
    }, new IroColor({h: 300, s: 100, v: 50}))).toBe(50);
    expect(getCurrentSliderValue({
      layoutDirection: 'vertical',
      sliderType: 'value'
    }, new IroColor({h: 300, s: 100, v: 100}))).toBe(100);
  });

});

describe('getSliderValueFromInput', () => {

  test('getSliderValueFromInput handles input coords inside the slider', () => {
    expect(getSliderValueFromInput({
      layoutDirection: 'vertical',
      width: 200,
      sliderSize: 30,
      borderWidth: 0,
      handleRadius: 8
    }, 100, 10)).toEqual(50);
  });

  test('getSliderValueFromInput handles input coords on the edge of the slider', () => {
    expect(getSliderValueFromInput({
      layoutDirection: 'vertical',
      width: 200,
      sliderSize: 30,
      borderWidth: 0,
      handleRadius: 8
    }, 0, 10)).toEqual(0);
  });

  test('getSliderValueFromInput handles input coords outside the slider', () => {
    expect(getSliderValueFromInput({
      layoutDirection: 'vertical',
      width: 200,
      sliderSize: 30,
      borderWidth: 0,
      handleRadius: 8
    }, -10, 10)).toEqual(0);
    expect(getSliderValueFromInput({
      layoutDirection: 'vertical',
      width: 200,
      sliderSize: 30,
      borderWidth: 0,
      handleRadius: 8
    }, -1000, 10)).toEqual(0);
    expect(getSliderValueFromInput({
      layoutDirection: 'vertical',
      width: 200,
      sliderSize: 30,
      borderWidth: 0,
      handleRadius: 8
    }, 600, 10)).toEqual(100);
  });

});

describe('getSliderGradient', () => {
  test('getSliderGradient handles hue type slider', () => {
    expect(getSliderGradient({
      layoutDirection: 'vertical',
      sliderType: 'hue'
    }, new IroColor())).toMatchObject([
      [0,      '#f00'],
      [16.666, '#ff0'],
      [33.333, '#0f0'],
      [50,     '#0ff'],
      [66.666, '#00f'],
      [83.333, '#f0f'],
      [100,    '#f00'],
    ]);
  });
  test('getSliderGradient handles saturation type slider', () => {
    expect(getSliderGradient({
      layoutDirection: 'vertical',
      sliderType: 'saturation'
    },  new IroColor('#f00'))).toMatchObject([
      [0, 'hsl(0,0%,100%)'],
      [100, 'hsl(0,100%,50%)'],
    ]);
    expect(getSliderGradient({
      layoutDirection: 'vertical',
      sliderType: 'saturation'
    }, new IroColor('#000'))).toMatchObject([
      [0, 'hsl(0,0%,0%)'],
      [100, 'hsl(0,0%,0%)'],
    ]);
  });
  test('getSliderGradient handles value type slider', () => {
    expect(getSliderGradient({
      layoutDirection: 'vertical',
      sliderType: 'value'
    }, new IroColor('#fff'))).toMatchObject([
      [0, '#000'],
      [100, 'hsl(0,0%,100%)'],
    ]);
    expect(getSliderGradient({
      layoutDirection: 'vertical',
      sliderType: 'value'
    }, new IroColor('#000'))).toMatchObject([
      [0, '#000'],
      [100, 'hsl(0,0%,100%)'],
    ]);
    expect(getSliderGradient({
      layoutDirection: 'vertical',
      sliderType: 'value'
    }, new IroColor('#f00'))).toMatchObject([
      [0, '#000'],
      [100, 'hsl(0,100%,50%)'],
    ]);

  });
});

describe('getSliderHandlePosition', () => {
  test('getSliderHandlePosition gets correct handle position', () => {
    expect(getSliderHandlePosition({
      layoutDirection: 'vertical',
      width: 300,
      sliderSize: 30,
      borderWidth: 0,
      handleRadius: 8
    }, new IroColor('#f00'))).toMatchObject({x: 285, y: 15});
    expect(getSliderHandlePosition({
      layoutDirection: 'vertical',
      width: 300,
      sliderSize: 30,
      borderWidth: 0,
      handleRadius: 8
    }, new IroColor('#000'))).toMatchObject({x: 15, y: 15});
    expect(getSliderHandlePosition({
      layoutDirection: 'vertical',
      width: 300,
      sliderSize: 40,
      borderWidth: 0,
      handleRadius: 8
    }, new IroColor({h: 0, s: 50, v: 50}))).toMatchObject({x: 150, y: 20});
  });
});