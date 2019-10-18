import { 
  translateWheelAngle,
  getWheelCenter,
  getWheelHandlePosition,
  getWheelValueFromInput
} from './wheel';
import { IroColor } from './color';

describe('translateWheelAngle', () => {

  test('translateWheelAngle translates clockwise angles without wheelAngle', () => {
    expect(translateWheelAngle({
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    }, 0)).toEqual(0);
    expect(translateWheelAngle({
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    }, 60)).toEqual(60);
    expect(translateWheelAngle({
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    }, 90)).toEqual(90);
    expect(translateWheelAngle({
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    }, 360)).toEqual(0);
  });

  test('translateWheelAngle translates clockwise angles with wheelAngle', () => {
    expect(translateWheelAngle({
      wheelAngle: 30,
      wheelDirection: 'clockwise',
    }, 0)).toEqual(330);
    expect(translateWheelAngle({
      wheelAngle: 60,
      wheelDirection: 'clockwise',
    }, 60)).toEqual(0);
    expect(translateWheelAngle({
      wheelAngle: 180,
      wheelDirection: 'clockwise',
    }, 90)).toEqual(270);
    expect(translateWheelAngle({
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    }, 360)).toEqual(0);
  });

  test('translateWheelAngle translates anticlockwise angles without wheelAngle', () => {
    expect(translateWheelAngle({
      wheelAngle: 0,
      wheelDirection: 'anticlockwise',
    }, 0)).toEqual(0);
    expect(translateWheelAngle({
      wheelAngle: 0,
      wheelDirection: 'anticlockwise',
    }, 60)).toEqual(300);
    expect(translateWheelAngle({
      wheelAngle: 0,
      wheelDirection: 'anticlockwise',
    }, 90)).toEqual(270);
    expect(translateWheelAngle({
      wheelAngle: 0,
      wheelDirection: 'anticlockwise',
    }, 360)).toEqual(0);
  });

  test('translateWheelAngle translates anticlockwise angles with wheelAngle', () => {
    expect(translateWheelAngle({
      wheelAngle: 90,
      wheelDirection: 'anticlockwise',
    }, 0)).toEqual(90);
    expect(translateWheelAngle({
      wheelAngle: 60,
      wheelDirection: 'anticlockwise',
    }, 180)).toEqual(240);
    expect(translateWheelAngle({
      wheelAngle: 100,
      wheelDirection: 'anticlockwise',
    }, 80)).toEqual(20);
    expect(translateWheelAngle({
      wheelAngle: 180,
      wheelDirection: 'anticlockwise',
    }, 180)).toEqual(0);
    expect(translateWheelAngle({
      wheelAngle: 270,
      wheelDirection: 'anticlockwise',
    }, 180)).toEqual(90);
  });

});

describe('getWheelCenter', () => {

  test('getWheelCenter returns the correct center point', () => {
    expect(getWheelCenter({ width: 200 })).toMatchObject({ x: 100, y: 100 });
    expect(getWheelCenter({ width: 160 })).toMatchObject({ x: 80, y: 80 });
    expect(getWheelCenter({ width: 128 })).toMatchObject({ x: 64, y: 64 });
  });
  
});

describe('getWheelHandlePosition', () => {

  test('getWheelHandlePosition returns the correct handle coords', () => {
    expect(getWheelHandlePosition({
      color: new IroColor('#f00'),
      width: 200,
      borderWidth: 0,
      padding: 8,
      handleRadius: 8,
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    })).toMatchObject({ x: 16, y: 100 });
    expect(getWheelHandlePosition({
      color: new IroColor({ h: 180, s: 50, v: 50 }),
      width: 200,
      borderWidth: 0,
      padding: 8,
      handleRadius: 8,
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    })).toMatchObject({ x: 142, y: 100 });
    expect(getWheelHandlePosition({
      color: new IroColor({ h: 180, s: 25, v: 50 }),
      width: 200,
      borderWidth: 0,
      padding: 0,
      handleRadius: 20,
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    })).toMatchObject({ x: 120, y: 100 });
  });

  test('getWheelHandlePosition returns the midpoint when saturation is 0', () => {
    expect(getWheelHandlePosition({
      color: new IroColor('#000'),
      width: 200,
      borderWidth: 0,
      padding: 8,
      handleRadius: 8,
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    })).toMatchObject({ x: 100, y: 100 });
    expect(getWheelHandlePosition({
      color: new IroColor('#fff'),
      width: 200,
      borderWidth: 0,
      padding: 8,
      handleRadius: 8,
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    })).toMatchObject({ x: 100, y: 100 });
  });
  
});

describe('getWheelValueFromInput', () => {

  test('getWheelValueFromInput handles input coords at wheel center', () => {
    expect(getWheelValueFromInput({
      width: 200,
      borderWidth: 0,
      padding: 8,
      handleRadius: 8,
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    }, 100, 100, { left: 0, top: 0 })).toMatchObject({ h: 180, s: 0 });
  });

  test('getWheelValueFromInput handles input coords inside wheel', () => {
    expect(getWheelValueFromInput({
      width: 200,
      borderWidth: 0,
      padding: 8,
      handleRadius: 8,
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    }, 20, 80, { left: 0, top: 0 })).toMatchObject({ h: 194, s: 98 });
    expect(getWheelValueFromInput({
      width: 200,
      borderWidth: 0,
      padding: 8,
      handleRadius: 8,
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    }, 45, 45, { left: 0, top: 0 })).toMatchObject({ h: 225, s: 93 });
    expect(getWheelValueFromInput({
      width: 200,
      borderWidth: 0,
      padding: 8,
      handleRadius: 8,
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    }, 90, 110, { left: 0, top: 0 })).toMatchObject({ h: 135, s: 17 });
  });

  test('getWheelValueFromInput handles input coords outside wheel', () => {
    expect(getWheelValueFromInput({
      width: 200,
      borderWidth: 0,
      padding: 8,
      handleRadius: 8,
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    }, 300, 100, { left: 0, top: 0 })).toMatchObject({ h: 0, s: 100 });
    expect(getWheelValueFromInput({
      width: 200,
      borderWidth: 0,
      padding: 8,
      handleRadius: 8,
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    }, -45, -45, { left: 0, top: 0 })).toMatchObject({ h: 225, s: 100 });
    expect(getWheelValueFromInput({
      width: 200,
      borderWidth: 0,
      padding: 8,
      handleRadius: 8,
      wheelAngle: 0,
      wheelDirection: 'clockwise',
    }, 300, 220, { left: 0, top: 0 })).toMatchObject({ h: 31, s: 100 });
  });
  
});