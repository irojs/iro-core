import {
  resolveSvgUrl,
  getSvgArcPath,
  getHandleAtPoint
} from './util';

describe('resolveUrl', () => {
  test('resolveUrl correctly resolves URL', () => {
    expect(resolveSvgUrl('#test')).toBe('#test');
  });

  test('resolveUrl correctly resolves full URL when a Safari userAgent and <base> tag is present', () => {
    Object.defineProperty(window.navigator, 'userAgent', {value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15'});
    document.head.innerHTML = '<base href="/" />';
    expect(resolveSvgUrl('#test')).toBe('http://localhost/#test');
    window.history.pushState({}, '', '/example');
    expect(resolveSvgUrl('#test')).toBe('http://localhost/example#test');
    window.history.pushState({}, '', '/example/');
    expect(resolveSvgUrl('#test')).toBe('http://localhost/example/#test');
    window.history.pushState({}, '', '/example?query=example');
    expect(resolveSvgUrl('#test')).toBe('http://localhost/example?query=example#test');
  });
});

describe('createArcPath', () => {
  test('createArcPath correctly creates path commands for arcs', () => {
    expect(getSvgArcPath(0, 0, 60, 0, 0)).toBe('M 60 0 A 60 60 0 0 0 60 0');
    expect(getSvgArcPath(10, 10, 60, 0, 0)).toBe('M 70 10 A 60 60 0 0 0 70 10');
    // could be more robust :/
  });
});

describe('getHandleAtPoint', () => {
  test('getHandleAtPoint correctly finds which handle is underneath a given point', () => {
    expect(getHandleAtPoint({handleRadius: 12}, 12, 12, [
      {x: 0, y: 0},
      {x: 12, y: 12},
      {x: 24, y: 24},
    ])).toEqual(1);
    expect(getHandleAtPoint({handleRadius: 12}, 34, 40, [
      {x: 36, y: 32},
      {x: 100, y: 0},
      {x: 90, y: 81},
    ])).toEqual(0);
    expect(getHandleAtPoint({handleRadius: 6}, 50, 23, [
      {x: 89, y: 13},
      {x: 66, y: 123},
      {x: 55, y: 23},
    ])).toEqual(2);
  });

  test('getHandleAtPoint returns null if no handle is underneath a given point', () => {
    expect(getHandleAtPoint({handleRadius: 12}, 12, 12, [
      {x: 0, y: 0},
      {x: 24, y: 24},
      {x: 48, y: 48},
    ])).toBeNull();
  });
});

