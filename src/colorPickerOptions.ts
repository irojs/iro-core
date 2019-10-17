import { IroColorValue } from './color';

export interface IroHandleOrigin {
  x: number;
  y: number;
}

export interface IroColorPickerOptions {
  width?: number;
  height?: number;
  handleRadius?: number;
  handleSvg?: string;
  handleOrigin?: IroHandleOrigin;
  color?: IroColorValue;
  borderColor?: string;
  borderWidth?: number;
  wheelLightness?: boolean;
  wheelAngle?: number;
  wheelDirection?: string;
  sliderHeight?: number;
  sliderMargin?: number;
  padding?: number;
}

export const iroColorPickerOptionDefaults: IroColorPickerOptions = {
  width: 300,
  height: 300,
  handleRadius: 8,
  handleSvg: null,
  handleOrigin: {x: 0, y: 0},
  color: '#fff',
  borderColor: '#fff',
  borderWidth: 0,
  wheelLightness: true,
  wheelAngle: 0,
  wheelDirection: 'anticlockwise',
  sliderHeight: null,
  sliderMargin: 12,
  padding: 6,
}