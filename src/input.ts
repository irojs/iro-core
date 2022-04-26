import { IroColor } from './color';
import { SliderType } from './slider';
import { IroColorPickerOptions } from './colorPickerOptions';

export interface InputOptions extends IroColorPickerOptions {
  color: IroColor;
  sliderType: SliderType;
  minTemperature: number;
  maxTemperature: number;
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
    case 'kelvin': // TODO
      const { minTemperature, maxTemperature } = props;
      return clamp(value, minTemperature, maxTemperature);
    }
}

/**
 * @desc Get the current slider value from input field input
 * @param props - slider props
 * @param e - KeyboardEvent
 */
export function getSliderValueFromInputField(props: Partial<InputOptions>, e: KeyboardEvent) {
  // regex for digit or dot (.)
  if (!/^([0-9]|\.)$/i.test((e).key)) {
    return 0;
  }
  let maxlen: number;
  if (props.sliderType === 'alpha') {
    maxlen = 4;
  } else if (props.sliderType === 'kelvin') {
    maxlen = 5;
  } else {
    maxlen = 3;
  }

  let target = (e.target as HTMLInputElement);
  let valueString = target.value.toString();
  if (target.selectionStart !== undefined) {
    valueString = valueString.substring(0, target.selectionStart) +
      e.key.toString() +
      valueString.substring(target.selectionEnd);
  } else {
    valueString = valueString.length + 1 > maxlen ? valueString : valueString + e.key.toString();
  }
  const valueNum = +valueString;
  return clampSliderValue(props, valueNum);
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