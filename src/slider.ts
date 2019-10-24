import { IroColor } from './color';
import { IroColorPickerOptions } from './colorPickerOptions';

export type SliderShape = 'bar' | 'circle' | '';
export type SliderType = 'hue' | 'saturation' | 'value' | 'temperature' | '';

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
    [props.layoutDirection === 'vertical' ? 'marginLeft' : 'marginTop']: props.sliderMargin
  }
}

/**
 * @desc Get the bounding dimensions of the slider
 * @param props - slider props
 */
export function getSliderDimensions(props: Partial<SliderOptions>) {
  let { width, sliderHeight, borderWidth, handleRadius, padding, sliderShape } = props;
  const isVertical = props.layoutDirection === 'vertical';
  // automatically calculate sliderHeight if its not defined
  sliderHeight = sliderHeight ? sliderHeight : padding * 2 + handleRadius * 2 + borderWidth * 2;
  const handleRange = width - sliderHeight;
  if (sliderShape === 'circle') {
    return {
      handleRange,
      width: width,
      height: width,
      cx: width / 2,
      cy: width / 2,
      radius: width / 2 - borderWidth / 2
    }
  } else {
    return {
      handleRange,
      radius: sliderHeight / 2,
      x: 0,
      y: 0,
      width: isVertical ? sliderHeight : width,
      height: isVertical ? width : sliderHeight,
    }
  }
}

/**
 * @desc Get the current slider value as a percentage
 * @param props - slider props
 */
export function getCurrentSliderValue(props: Partial<SliderOptions>) {
  const hsv = props.color.hsv;
  switch (props.sliderType) {
    case 'temperature':
      const { minTemperature, maxTemperature } = props;
      const temperatureRange = maxTemperature - minTemperature;
      const percent = ((props.color.kelvin - minTemperature) / temperatureRange) * 100;
      // clmap percentage
      return Math.max(0, Math.min(percent, 100));
    case 'hue':
      return hsv.h /= 3.6;
    case 'saturation':
      return hsv.s;
    case 'value':
    default:
      return hsv.v;
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
  const { handleRange, radius } = getSliderDimensions(props);
  let handlePos;
  if (props.layoutDirection === 'vertical') {
    handlePos = -1 * (y - bounds.top) + handleRange + radius;
  } else {
    handlePos = x - (bounds.left + radius);
  }
  // clamo handle position
  handlePos = Math.max(Math.min(handlePos, handleRange), 0);
  const percent = Math.round((100 / handleRange) * handlePos);
  switch (props.sliderType) {
    case 'temperature':
      const { minTemperature, maxTemperature } = props;
      const temperatureRange = maxTemperature - minTemperature;
      return minTemperature + temperatureRange * (percent / 100);
    case 'hue':
      return percent * 3.6;
    default:
      return percent;
  }
}

/**
 * @desc Get the current slider position
 * @param props - slider props
 */
export function getSliderHandlePosition(props: Partial<SliderOptions>) {
  const { width, height, radius, handleRange } = getSliderDimensions(props);
  const isVertical = props.layoutDirection === 'vertical';
  const sliderValue = getCurrentSliderValue(props);
  const midPoint = isVertical ? width / 2 : height / 2;
  let handlePos = radius + (sliderValue / 100) * handleRange;
  if (isVertical) {
    handlePos = -1 * handlePos + handleRange + radius * 2;
  } 
  return {x: isVertical ? midPoint : handlePos, y: isVertical ? handlePos : midPoint};
}

/**
 * @desc Get the gradient stops for a slider
 * @param props - slider props
 */
export function getSliderGradient(props: Partial<SliderOptions>) {
  const hsv = props.color.hsv;

  switch (props.sliderType) {
    case 'temperature':
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
        [0, `hsl(${noSat.h}, ${noSat.s}%, ${noSat.l}%)`],
        [100, `hsl(${fullSat.h}, ${fullSat.s}%, ${fullSat.l}%)`]
      ];
    case 'value':
    default:
      const hsl = IroColor.hsvToHsl({h: hsv.h, s: hsv.s, v: 100});
      return [
        [0, '#000'],
        [100, `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`]
      ];
  }
}

/**
 * @desc Get the gradient coords for a slider
 * @param props - slider props
 */
export function getSliderGradientCoords(props: Partial<SliderOptions>) {
  const isVertical = props.layoutDirection === 'vertical';
  return {
    x1: '0%',
    y1: isVertical ? '100%' : '0%',
    x2: isVertical ? '0%' : '100%',
    y2: '0%'
  }
}