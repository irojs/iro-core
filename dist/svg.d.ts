/**
 * @desc Resolve an SVG reference URL
 * This is required to work around how Safari and iOS webviews handle gradient URLS under certain conditions
 * If a page is using a client-side routing library which makes use of the HTML <base> tag,
 * Safari won't be able to render SVG gradients properly (as they are referenced by URLs)
 * More info on the problem:
 * https://stackoverflow.com/questions/19742805/angular-and-svg-filters/19753427#19753427
 * https://github.com/jaames/iro.js/issues/18
 * https://github.com/jaames/iro.js/issues/45
 * https://github.com/jaames/iro.js/pull/89
 * @props url - SVG reference URL
 */
export declare function resolveSvgUrl(url: string): string;
/**
 * @desc Get the path commands to draw an svg arc
 * @props cx - arc center point x
 * @props cy - arc center point y
 * @props radius - arc radius
 * @props startAngle - arc start angle
 * @props endAngle - arc end angle
 */
export declare function getSvgArcPath(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string;
