/**
 * Resolve an SVG URL
 * This is required to work around how Safari handles gradient URLS under certain conditions
 * If a page is using a client-side routing library which makes use of the HTML <base> tag,
 * Safari won't be able to render SVG gradients properly (as they are referenced by URLs)
 * More info on the problem:
 * https://stackoverflow.com/questions/19742805/angular-and-svg-filters/19753427#19753427
 * https://github.com/jaames/iro.js/issues/18
 * https://github.com/jaames/iro.js/issues/45
 */
export declare function resolveSvgUrl(url: any): any;
/**
 * Get the path commands to draw an svg arc
 */
export declare function getSvgArcPath(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string;
