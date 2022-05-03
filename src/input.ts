import { IroColor } from './color';
import { SliderType } from './slider';
import { IroColorPickerOptions } from './colorPickerOptions';

export interface InputOptions extends IroColorPickerOptions {
  color: IroColor;
  sliderType: SliderType;
  sliderSize: number;
  minTemperature: number;
  maxTemperature: number;
}

/**
 * @desc Get input field dimensions
 * @param props - InputOptions
 */
 export function getInputDimensions(props: Partial<InputOptions>) {
  let {sliderSize, layoutDirection} = props;
  let inputWidth: number;
  let fontSize: number;

  if (layoutDirection === 'vertical') {
    inputWidth = 30;
    fontSize = 12;
  } else {
    inputWidth = sliderSize <= 30 ? 26 : sliderSize;
    fontSize = sliderSize <= 30 ? 10 : 12;
  }

  return {
    inputWidth: inputWidth,
    inputHeight: 18,
    fontSize: fontSize
  }
}

/**
 * @desc Clamp slider value between min and max values
 * @param type - props.sliderType
 * @param value - value to clamp
 */
 export function clampSliderValue(props: Partial<InputOptions>, value: number) {
  function clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
  }
  switch(props.sliderType) {
    case 'hue':
      return clamp(value, 0, 360);
    case 'saturation':
    case 'value':
      return clamp(value, 0, 100);
    case 'red':
    case 'green':
    case 'blue':
      return clamp(value, 0, 255);
    case 'alpha':
      return clamp(value, 0, 1);
    case 'kelvin':
      const { minTemperature, maxTemperature } = props;
      return clamp(value, minTemperature, maxTemperature);
    }
}

/**
 * @desc Get the current slider value from input field input
 * @param props - slider props
 * @param e - KeyboardEvent
 */
export function getSliderValueFromInputField(e: KeyboardEvent) {
  let target = (e.target as HTMLInputElement);
  let valueNum = parseInt(target.value);
  // regex for digit or dot (.)
  if (!/^([0-9]|\.)$/i.test((e).key)) {
    e.preventDefault();
    return valueNum;
  }
  let valueString = target.value.toString();
  if (target.selectionStart !== undefined) { // cursor position
    valueString = valueString.substring(0, target.selectionStart) +
      e.key.toString() +
      valueString.substring(target.selectionEnd);
  } else {
    valueString = valueString + e.key.toString();
  }
  return +valueString;
}

/**
 * @desc Get the current slider value from clipboard data
 * @param props - slider props
 * @param e - ClipboardEvent
 */
 export function getSliderValueFromClipboard(props: Partial<InputOptions>, e: ClipboardEvent) {
  // allow only whole or decimal numbers
  const r = /^[+]?([.]\d+|\d+([.]\d+)?)$/i;
  const valueString: string = e.clipboardData.getData('text');
  if (!r.test(valueString)) {
    return 0;
  }
  const valueNum = +valueString;
  return clampSliderValue(props, valueNum);
}