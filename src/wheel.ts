import { IroColorPickerOptions } from './colorPickerOptions';
import { IroColor } from './color';

export interface WheelProps extends IroColorPickerOptions {
  color: IroColor;
}

/**
 * @desc Get the point as the center of the wheel
 * @param props - wheel props
 */
export function getWheelDimensions(props: Partial<WheelProps>) {
  const rad = props.width / 2;
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
export function translateWheelAngle(props: Partial<WheelProps>, angle: number) {
  const wheelAngle = props.wheelAngle;
  if (props.wheelDirection === 'clockwise') {
    angle = -360 + angle - wheelAngle;
  } else {
    angle = wheelAngle - angle
  }
  // javascript's modulo operator doesn't produce positive numbers with negative input
  // https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
  return (angle % 360 + 360) % 360;
}

/**
 * @desc Get the current handle position
 * @param props - wheel props
 */
export function getWheelHandlePosition(props: Partial<WheelProps>) {
  const hsv = props.color.hsv;
  const { cx, cy } = getWheelDimensions(props);
  const handleRange = props.width / 2 - props.padding - props.handleRadius - props.borderWidth;
  const handleAngle = translateWheelAngle(props, hsv.h) * (Math.PI / 180);
  const handleDist = (hsv.s / 100) * handleRange;
  const direction = props.wheelDirection === 'clockwise' ? -1 : 1;
  return {
    x: cx + handleDist * Math.cos(handleAngle) * direction,
    y: cy + handleDist * Math.sin(handleAngle) * direction,
  }
}

/**
 * @desc Get the current wheel value from user input
 * @param props - wheel props
 * @param x - global input x position
 * @param y - global input y position
 * @param bounds - wheel element bounding box
 */
export function getWheelValueFromInput(props: Partial<WheelProps>, x: number, y: number, bounds: any) {
  const { cx, cy } = getWheelDimensions(props);
  const handleRange = props.width / 2 - props.padding - props.handleRadius - props.borderWidth;
  x = cx - (x - bounds.left);
  y = cy - (y - bounds.top);
  // Calculate the hue by converting the angle to radians
  const hue = translateWheelAngle(props, Math.atan2(-y, -x) * (180 / Math.PI));
  // Find the point's distance from the center of the wheel
  // This is used to show the saturation level
  const handleDist = Math.min(Math.sqrt(x * x + y * y), handleRange);
  return {
    h: Math.round(hue),
    s: Math.round((100 / handleRange) * handleDist)
  };
}