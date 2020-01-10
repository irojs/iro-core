import { IroColor } from './color';
import { IroColorPickerOptions } from './colorPickerOptions';

export type SliderShape = 'bar' | 'circle' | '';
export type SliderType = 'hue' | 'saturation' | 'value' | 'alpha' | 'kelvin' | '';

export interface SliderOptions extends IroColorPickerOptions {
  color: IroColor;
  sliderShape: SliderShape;
  sliderType: SliderType;
  minTemperature: number;
  maxTemperature: number;
}

export const sliderDefaultOptions = {
  sliderShape: 'bar',
  sliderType: 'value',
  minTemperature: 2200,
  maxTemperature: 11000
}

/**
 * @desc Get the CSS styles for the slider root
 * @param props - slider props
 */
export function getSliderStyles(props: Partial<SliderOptions>) {
  return {
    [props.layoutDirection === 'horizontal' ? 'marginLeft' : 'marginTop']: props.sliderMargin
  }
}

/**
 * @desc Get the bounding dimensions of the slider
 * @param props - slider props
 */
export function getSliderDimensions(props: Partial<SliderOptions>) {
  let { width, sliderSize: sliderSize, borderWidth, handleRadius, padding, sliderShape } = props;
  const ishorizontal = props.layoutDirection === 'horizontal';
  // automatically calculate sliderSize if its not defined
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
    }
  } else {
    return {
      handleStart: sliderSize / 2,
      handleRange: width - sliderSize,
      radius: sliderSize / 2,
      x: 0,
      y: 0,
      width: ishorizontal ? sliderSize : width,
      height: ishorizontal ? width : sliderSize,
    }
  }
}

/**
 * @desc Get the current slider value for a given color, as a percentage
 * @param props - slider props
 * @param color
 */
export function getCurrentSliderValue(props: Partial<SliderOptions>, color: IroColor) {
  const hsva = color.hsva;
  switch (props.sliderType) {
    case 'alpha':
      return hsva.a * 100;
    case 'kelvin':
      const { minTemperature, maxTemperature } = props;
      const temperatureRange = maxTemperature - minTemperature;
      const percent = ((color.kelvin - minTemperature) / temperatureRange) * 100;
      // clmap percentage
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
 * @param bounds - slider element bounding box
 */
export function getSliderValueFromInput(props: Partial<SliderOptions>, x: number, y: number, bounds: any) {
  const { handleRange, handleStart } = getSliderDimensions(props);
  let handlePos;
  if (props.layoutDirection === 'horizontal') {
    handlePos = -1 * (y - bounds.top) + handleRange + handleStart;
  } else {
    handlePos = x - (bounds.left + handleStart);
  }
  // clamp handle position
  handlePos = Math.max(Math.min(handlePos, handleRange), 0);
  const percent = Math.round((100 / handleRange) * handlePos);
  switch (props.sliderType) {
    case 'kelvin':
      const { minTemperature, maxTemperature } = props;
      const temperatureRange = maxTemperature - minTemperature;
      return minTemperature + temperatureRange * (percent / 100);
    case 'alpha':
      return percent / 100;
    case 'hue':
      return percent * 3.6;
    default:
      return percent;
  }
}

/**
 * @desc Get the current handle position for a given color
 * @param props - slider props
 * @param color
 */
export function getSliderHandlePosition(props: Partial<SliderOptions>, color: IroColor) {
  const { width, height, handleRange, handleStart } = getSliderDimensions(props);
  const ishorizontal = props.layoutDirection === 'horizontal';
  const sliderValue = getCurrentSliderValue(props, color);
  const midPoint = ishorizontal ? width / 2 : height / 2;
  let handlePos = handleStart + (sliderValue / 100) * handleRange;
  if (ishorizontal) {
    handlePos = -1 * handlePos + handleRange + handleStart * 2;
  } 
  return {x: ishorizontal ? midPoint : handlePos, y: ishorizontal ? handlePos : midPoint};
}

/**
 * @desc Get the gradient stops for a slider
 * @param props - slider props
 * @param color
 */
export function getSliderGradient(props: Partial<SliderOptions>, color: IroColor) {
  const hsv = color.hsv;

  switch (props.sliderType) {
    case 'alpha':
      const rgb = color.rgb;
      return [
        [0, `rgba(${ rgb.r },${ rgb.g },${ rgb.b },0)`],
        [100, `rgb(${ rgb.r },${ rgb.g },${ rgb.b })`],
      ]
    case 'kelvin':
      const stops = [];
      const min = props.minTemperature;
      const max = props.maxTemperature;
      const numStops = 8;
      const range = max - min;
      for (let kelvin = min, stop = 0; kelvin < max; kelvin += range / numStops, stop += 1) {
        const { r, g, b } = IroColor.kelvinToRgb(kelvin);
        stops.push([ 100 / numStops * stop, `rgb(${r},${g},${b})` ]);
      }
      return stops;
    case 'hue':
      return [
        [0,      '#f00'],
        [16.666, '#ff0'],
        [33.333, '#0f0'],
        [50,     '#0ff'],
        [66.666, '#00f'],
        [83.333, '#f0f'],
        [100,    '#f00'],
      ];
    case 'saturation':
      const noSat = IroColor.hsvToHsl({h: hsv.h, s: 0, v: hsv.v});
      const fullSat = IroColor.hsvToHsl({h: hsv.h, s: 100, v: hsv.v});
      return [
        [0, `hsl(${noSat.h},${noSat.s}%,${noSat.l}%)`],
        [100, `hsl(${fullSat.h},${fullSat.s}%,${fullSat.l}%)`]
      ];
    case 'value':
    default:
      const hsl = IroColor.hsvToHsl({h: hsv.h, s: hsv.s, v: 100});
      return [
        [0, '#000'],
        [100, `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`]
      ];
  }
}

/**
 * @desc Get the gradient coords for a slider
 * @param props - slider props
 */
export function getSliderGradientCoords(props: Partial<SliderOptions>) {
  const ishorizontal = props.layoutDirection === 'horizontal';
  return {
    x1: '0%',
    y1: ishorizontal ? '100%' : '0%',
    x2: ishorizontal ? '0%' : '100%',
    y2: '0%'
  }
}