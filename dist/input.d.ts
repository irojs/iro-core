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
export declare function getInputDimensions(props: Partial<InputOptions>): {
    inputWidth: number;
    inputHeight: number;
    fontSize: number;
};
/**
 * @desc Clamp slider value between min and max values
 * @param type - props.sliderType
 * @param value - value to clamp
 */
export declare function clampSliderValue(props: Partial<InputOptions>, value: number): number;
/**
 * @desc Get the current slider value from input field input
 * @param props - slider props
 * @param e - KeyboardEvent
 */
export declare function getSliderValueFromInputField(e: KeyboardEvent): number;
/**
 * @desc Get the current slider value from clipboard data
 * @param props - slider props
 * @param e - ClipboardEvent
 */
export declare function getSliderValueFromClipboard(props: Partial<InputOptions>, e: ClipboardEvent): number;
