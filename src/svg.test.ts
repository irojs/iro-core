import {
  resolveSvgUrl,
  getSvgArcPath
} from './svg';

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

