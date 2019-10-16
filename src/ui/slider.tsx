import { h } from 'preact';

import { getSliderDimensions, getSliderValueFromInput, getSliderHandlePosition, getSliderGradient } from '../core/sliderUtils';

import { IroComponent, IroComponentProps, EventResult } from './component';
import { IroHandle } from './handle';
import { resolveSvgUrl } from '../core/svgUtils';

interface IroSliderProps extends IroComponentProps {
  sliderType: string;
}

interface IroSliderState {}

export class IroSlider extends IroComponent<IroSliderProps, IroSliderState> {
  public height: number;
  public width: number;

  render(props: any) {
    const {
      x, 
      y,
      width,
      height,
      radius
    } = getSliderDimensions(props);
    
    const handlePos = getSliderHandlePosition(props);
    const gradient = getSliderGradient(props);

    return (
      <svg 
        className="iro__slider"
        width={ width }
        height={ height }
        style= {{
          marginTop: props.sliderMargin,
          overflow: 'visible',
          display: 'block'
        }}
      >
        <defs>
          <linearGradient id={ this.uid }>
            {gradient.map(stop => (
              <stop offset={`${stop.offset}%`} stop-color={ stop.color } />
            ))}
          </linearGradient>
        </defs>
        <rect 
          className="iro__slider__value"
          rx={ radius } 
          ry={ radius } 
          x={ props.borderWidth / 2 } 
          y={ props.borderWidth / 2 } 
          width={ width - props.borderWidth } 
          height={ height - props.borderWidth }
          stroke-width={ props.borderWidth }
          stroke={ props.borderColor }
          fill={ `url(${resolveSvgUrl('#' + this.uid)})` }
        />
        <IroHandle
          r={ props.handleRadius }
          url={ props.handleSvg }
          origin={ props.handleOrigin }
          x={ handlePos.x }
          y={ handlePos.y }
        />
      </svg>
    );
  }

  /**
    * @desc handles mouse input for this component
    * @param {Number} x - point x coordinate
    * @param {Number} y - point y coordinate
    * @param {DOMRect} rect - bounding client rect for the component's base element
    * @param {String} type - input type: "START", "MOVE" or "END"
  */
  handleInput(x: number, y: number, bounds: DOMRect | ClientRect, type: EventResult) {
    let value = getSliderValueFromInput(this.props, x, y, bounds);
    let channel;
    switch (this.props.sliderType) {
      case 'hue':
        channel = 'h';
        value *= 3.6;
        break;
      case 'saturation':
        channel = 's';
        break;
      case 'value':
      default:
        channel = 'v';
        break;
    }
    this.props.onInput(type, {
      [channel]: value
    });
  }
}