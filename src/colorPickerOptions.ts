import { IroColor, IroColorValue } from './color';

export type LayoutDirection = 'vertical' | 'horizontal' | '';

export type WheelDirection = 'clockwise' | 'anticlockwise' | '';

export interface IroColorPickerOptions {
  width?: number;
  height?: number;
  color?: IroColorValue;
  colors?: IroColorValue[];
  padding?: number;
  layoutDirection?: LayoutDirection;
  borderColor?: string;
  borderWidth?: number;
  handleRadius?: number;
  activeHandleRadius?: number;
  handleSvg?: string;
  handleProps?: any;
  wheelLightness?: boolean;
  wheelAngle?: number;
  wheelDirection?: WheelDirection;
  sliderSize?: number;
  sliderMargin?: number;
  boxHeight?: number;
}

export const iroColorPickerOptionDefaults: IroColorPickerOptions = {
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
  handleProps: {x: 0, y: 0},
  wheelLightness: true,
  wheelAngle: 0,
  wheelDirection: 'anticlockwise',
  sliderSize: null,
  sliderMargin: 12,
  boxHeight: null
}