import { IroColor, IroColorValue } from './color';

export type LayoutDirection = 'vertical' | 'horizontal' | '';

export type WheelDirection = 'clockwise' | 'anticlockwise' | '';

export interface IroColorPickerOptions {
  width?: number;
  height?: number;
  handleRadius?: number;
  handleSvg?: string;
  handleProps?: any;
  color?: IroColorValue;
  borderColor?: string;
  borderWidth?: number;
  wheelLightness?: boolean;
  wheelAngle?: number;
  wheelDirection?: WheelDirection;
  layoutDirection?: LayoutDirection;
  sliderSize?: number;
  sliderMargin?: number;
  padding?: number;
}

export const iroColorPickerOptionDefaults: IroColorPickerOptions = {
  width: 300,
  height: 300,
  handleRadius: 8,
  handleSvg: null,
  handleProps: {x: 0, y: 0},
  color: '#fff',
  borderColor: '#fff',
  borderWidth: 0,
  wheelLightness: true,
  wheelAngle: 0,
  wheelDirection: 'anticlockwise',
  layoutDirection: 'vertical',
  sliderSize: null,
  sliderMargin: 12,
  padding: 6,
}