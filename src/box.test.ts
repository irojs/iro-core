import { 
  getBoxDimensions,
  getBoxHandlePosition,
  getBoxValueFromInput,
  getBoxGradients
} from './box';
import { IroColor } from './color';

describe('getBoxDimensions', () => {

  test('getBoxDimensions returns correct dimensions', () => {
    expect(getBoxDimensions({
      width: 300,
      padding: 8,
      handleRadius: 8
    })).toMatchObject({
      width: 300,
      height: 300,
      radius: 16
    });
    expect(getBoxDimensions({
      width: 200,
      padding: 12,
      handleRadius: 2
    })).toMatchObject({
      width: 200,
      height: 200,
      radius: 14
    });
  });

});

describe('getBoxHandlePosition', () => {

  test('getBoxHandlePosition returns correct handle position', () => {
    expect(getBoxHandlePosition({
      color: new IroColor({ h: 0, s: 0, v: 100 }),
      width: 300,
      padding: 8,
      handleRadius: 8
    })).toMatchObject({
      x: 16,
      y: 16
    });
    expect(getBoxHandlePosition({
      color: new IroColor({ h: 0, s: 50, v: 50 }),
      width: 300,
      padding: 8,
      handleRadius: 8
    })).toMatchObject({
      x: 150,
      y: 150
    });
    expect(getBoxHandlePosition({
      color: new IroColor({ h: 0, s: 100, v: 0 }),
      width: 300,
      padding: 8,
      handleRadius: 8
    })).toMatchObject({
      x: 284,
      y: 284
    });
  });

});

describe('getBoxValueFromInput', () => {

  test('getBoxValueFromInput handles input coords inside the box', () => {
    expect(getBoxValueFromInput({
      width: 200,
      borderWidth: 0,
      padding: 8,
      handleRadius: 8
    }, 100, 100, {
      left: 0,
      top: 0,
    })).toEqual({ v: 50, s: 50 });
  });

  test('getBoxValueFromInput handles input coords on the edge of the box', () => {
    expect(getBoxValueFromInput({
      width: 200,
      borderWidth: 0,
      padding: 8,
      handleRadius: 8
    }, 184, 16, {
      left: 0,
      top: 0,
    })).toEqual({ v: 100, s: 100 });
  });

  test('getBoxValueFromInput handles input coords outside the box', () => {
    expect(getBoxValueFromInput({
      width: 200,
      borderWidth: 0,
      padding: 8,
      handleRadius: 8
    }, 300, -10, {
      left: 0,
      top: 0,
    })).toEqual({ v: 100, s: 100 });
  });

});