import { IroColor } from './color';

export function getSliderDimensions(props: any) {
  let { width, sliderHeight, borderWidth, handleRadius, padding } = props;
  sliderHeight = sliderHeight ? sliderHeight : padding * 2 + handleRadius * 2 + borderWidth * 2;
  return {
    radius: sliderHeight / 2,
    x: 0,
    y: 0,
    width: width,
    height: sliderHeight,
  }
}

export function getCurrentSliderValue(props: any) {
  const hsv = props.color.hsv;
  switch (props.sliderType) {
    case 'hue':
      return hsv.h /= 3.6;
    case 'saturation':
      return hsv.s;
    case 'value':
    default:
      return hsv.v;
  }
}

export function getSliderValueFromInput(props: any, x: number, y: number, bounds) {
  const handleRange = bounds.width - bounds.height;
  const cornerRadius = bounds.height / 2;
  let dist = x - (bounds.left + cornerRadius);
  dist = Math.max(Math.min(dist, handleRange), 0);
  const percent = Math.round((100 / handleRange) * dist);
  switch (props.sliderType) {
    case 'hue':
      return percent * 3.6;
    default:
      return percent;
  }
}

export function getSliderHandlePosition(props: any) {
  const { width, height, radius } = getSliderDimensions(props);
  const sliderValue = getCurrentSliderValue(props);
  const handleRange = width - radius * 2;
  const x = radius + (sliderValue / 100) * handleRange;
  const y = height / 2;
  return {x, y};
}

export function getSliderGradient(props: any) {
  const hsv = props.color.hsv;

  switch (props.sliderType) {
    case 'kelvin':
      const stops = [];
      const min = 3000;
      const max = 9000;
      const numStops = 12;
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