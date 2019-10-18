var t="(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",e="[\\s|\\(]+("+t+")[,|\\s]+("+t+")[,|\\s]+("+t+")\\s*\\)?",r="[\\s|\\(]+("+t+")[,|\\s]+("+t+")[,|\\s]+("+t+")[,|\\s]+("+t+")\\s*\\)?",n=new RegExp("rgb"+e),i=new RegExp("rgba"+r),s=new RegExp("hsl"+e),h=new RegExp("hsla"+r),a=new RegExp("^(?:#?|0x?)([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$"),o=new RegExp("^(?:#?|0x?)([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$"),l=new RegExp("^(?:#?|0x?)([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$"),u=new RegExp("^(?:#?|0x?)([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$");function f(t,e){var r=t.indexOf("%")>-1,n=parseFloat(t);return r?e/100*n:n}function c(t){return parseInt(t,16)}function g(t){return t.toString(16).padStart(2,"0")}var v=function(t,e){this.value={h:0,s:0,v:0,a:1},t&&this.set(t),this.onChange=e},d={hsv:{configurable:!0},rgb:{configurable:!0},hsl:{configurable:!0},rgbString:{configurable:!0},hexString:{configurable:!0},hslString:{configurable:!0}};function b(t){var e=t.sliderHeight;return{radius:(e=e||2*t.padding+2*t.handleRadius+2*t.borderWidth)/2,x:0,y:0,width:t.width,height:e}}function w(t){var e=t.color.hsv;switch(t.sliderType){case"hue":return e.h/=3.6;case"saturation":return e.s;case"value":default:return e.v}}function p(t,e,r,n){var i=n.width-n.height,s=e-(n.left+n.height/2);s=Math.max(Math.min(s,i),0);var h=Math.round(100/i*s);switch(t.sliderType){case"hue":return 3.6*h;default:return h}}function x(t){var e=b(t),r=e.width,n=e.height,i=e.radius;return{x:i+w(t)/100*(r-2*i),y:n/2}}function M(t){var e=t.color.hsv;switch(t.sliderType){case"hue":return[["0","#f00"],["16.666","#ff0"],["33.333","#0f0"],["50","#0ff"],["66.666","#00f"],["83.333","#f0f"],["100","#f00"]];case"saturation":var r=v.hsvToHsl({h:e.h,s:0,v:e.v}),n=v.hsvToHsl({h:e.h,s:100,v:e.v});return[["0","hsl("+r.h+", "+r.s+"%, "+r.l+"%)"],["100","hsl("+n.h+", "+n.s+"%, "+n.l+"%)"]];case"value":default:var i=v.hsvToHsl({h:e.h,s:e.s,v:100});return[["0","#000"],["100","hsl("+i.h+", "+i.s+"%, "+i.l+"%)"]]}}function y(t,e){var r=t.wheelAngle;return((e="clockwise"===t.wheelDirection?-360+e-r:r-e)%360+360)%360}function A(t){var e=t.width/2;return{x:e,y:e}}function F(t){var e=t.color.hsv,r=t.borderWidth,n=t.padding,i=t.handleRadius,s=t.wheelDirection,h=t.width/2-r,a=A(t),o=y(t,e.h)*(Math.PI/180),l=e.s/100*(h-n-i-r),u="clockwise"===s?-1:1;return{x:a.x+l*Math.cos(o)*u,y:a.y+l*Math.sin(o)*u}}function S(t,e,r,n){var i=t.width/2,s=i-t.padding-t.handleRadius-t.borderWidth;e=i-(e-n.left),r=i-(r-n.top);var h=Math.atan2(r,e),a=y(t,Math.round(h*(180/Math.PI))+180),o=Math.min(Math.sqrt(e*e+r*r),s);return{h:a,s:Math.round(100/s*o)}}function R(t){var e=window.navigator.userAgent,r=/^((?!chrome|android).)*safari/i.test(e),n=/iPhone|iPod|iPad/i.test(e),i=window.location;return r||n?i.protocol+"//"+i.host+i.pathname+i.search+t:t}function T(t,e,r,n,i){var s=i-n<=180?0:1;return n*=Math.PI/180,i*=Math.PI/180,"M "+(t+r*Math.cos(i))+" "+(e+r*Math.sin(i))+" A "+r+" "+r+" 0 "+s+" 0 "+(t+r*Math.cos(n))+" "+(e+r*Math.sin(n))}v.prototype.set=function(t){if("string"==typeof t&&/^(?:#?|0x?)[0-9a-fA-F]{3,8}$/.test(t))this.hexString=t;else if("string"==typeof t&&/^rgba?/.test(t))this.rgbString=t;else if("string"==typeof t&&/^hsla?/.test(t))this.hslString=t;else if("object"==typeof t&&t instanceof v)this.hsv=t.hsv;else if("object"==typeof t&&"r"in t&&"g"in t&&"b"in t)this.rgb=t;else if("object"==typeof t&&"h"in t&&"s"in t&&"v"in t)this.hsv=t;else{if(!("object"==typeof t&&"h"in t&&"s"in t&&"l"in t))throw new Error("invalid color value");this.hsl=t}},v.prototype.setChannel=function(t,e,r){var n;this[t]=Object.assign({},this[t],((n={})[e]=r,n))},v.prototype.clone=function(){return new v(this)},v.hsvToRgb=function(t){var e=t.h/60,r=t.s/100,n=t.v/100,i=Math.floor(e),s=e-i,h=n*(1-r),a=n*(1-s*r),o=n*(1-(1-s)*r),l=i%6;return{r:255*[n,a,h,h,o,n][l],g:255*[o,n,n,a,h,h][l],b:255*[h,h,o,n,n,a][l]}},v.rgbToHsv=function(t){var e=t.r/255,r=t.g/255,n=t.b/255,i=Math.max(e,r,n),s=Math.min(e,r,n),h=i-s,a=0,o=i,l=0===i?0:h/i;switch(i){case s:a=0;break;case e:a=(r-n)/h+(r<n?6:0);break;case r:a=(n-e)/h+2;break;case n:a=(e-r)/h+4}return{h:60*a,s:100*l,v:100*o}},v.hsvToHsl=function(t){var e=t.s/100,r=t.v/100,n=(2-e)*r,i=n<=1?n:2-n;return{h:t.h,s:100*(i<1e-9?0:e*r/i),l:50*n}},v.hslToHsv=function(t){var e=2*t.l,r=t.s*(e<=100?e:200-e)/100;return{h:t.h,s:100*(e+r<1e-9?0:2*r/(e+r)),v:(e+r)/2}},d.hsv.get=function(){var t=this.value;return{h:t.h,s:t.s,v:t.v}},d.hsv.set=function(t){var e=this.value;if(t=Object.assign({},e,t),this.onChange){var r={h:!1,v:!1,s:!1,a:!1};for(var n in e)r[n]=t[n]!=e[n];this.value=t,(r.h||r.s||r.v||r.a)&&this.onChange(this,r)}else this.value=t},d.rgb.get=function(){var t=v.hsvToRgb(this.value),e=t.g,r=t.b;return{r:Math.round(t.r),g:Math.round(e),b:Math.round(r)}},d.rgb.set=function(t){this.hsv=Object.assign({},v.rgbToHsv(t),{a:void 0===t.a?1:t.a})},d.hsl.get=function(){var t=v.hsvToHsl(this.value),e=t.s,r=t.l;return{h:Math.round(t.h),s:Math.round(e),l:Math.round(r)}},d.hsl.set=function(t){this.hsv=Object.assign({},v.hslToHsv(t),{a:void 0===t.a?1:t.a})},d.rgbString.get=function(){var t=this.rgb;return"rgb("+t.r+", "+t.g+", "+t.b+")"},d.rgbString.set=function(t){var e,r,s,h,a=1;if((e=n.exec(t))?(r=f(e[1],255),s=f(e[2],255),h=f(e[3],255)):(e=i.exec(t))&&(r=f(e[1],255),s=f(e[2],255),h=f(e[3],255),a=f(e[4],1)),!e)throw new Error("invalid rgb string");this.rgb={r:r,g:s,b:h,a:a}},d.hexString.get=function(){var t=this.rgb;return"#"+g(t.r)+g(t.g)+g(t.b)},d.hexString.set=function(t){var e,r,n,i,s=255;if((e=a.exec(t))?(r=17*c(e[1]),n=17*c(e[2]),i=17*c(e[3])):(e=o.exec(t))?(r=17*c(e[1]),n=17*c(e[2]),i=17*c(e[3]),s=17*c(e[4])):(e=l.exec(t))?(r=c(e[1]),n=c(e[2]),i=c(e[3])):(e=u.exec(t))&&(r=c(e[1]),n=c(e[2]),i=c(e[3]),s=c(e[4])),!e)throw new Error("invalid hex string");this.rgb={r:r,g:n,b:i,a:s/255}},d.hslString.get=function(){var t=this.hsl;return"hsl("+t.h+", "+t.s+"%, "+t.l+"%)"},d.hslString.set=function(t){var e,r,n,i,a=1;if((e=s.exec(t))?(r=f(e[1],360),n=f(e[2],100),i=f(e[3],100)):(e=h.exec(t))&&(r=f(e[1],360),n=f(e[2],100),i=f(e[3],100),a=f(e[4],1)),!e)throw new Error("invalid hsl string");this.hsl={h:r,s:n,l:i,a:a}},Object.defineProperties(v.prototype,d);var E={width:300,height:300,handleRadius:8,handleSvg:null,handleOrigin:{x:0,y:0},color:"#fff",borderColor:"#fff",borderWidth:0,wheelLightness:!0,wheelAngle:0,wheelDirection:"anticlockwise",sliderHeight:null,sliderMargin:12,padding:6};export{v as IroColor,b as getSliderDimensions,w as getCurrentSliderValue,p as getSliderValueFromInput,x as getSliderHandlePosition,M as getSliderGradient,y as translateWheelAngle,A as getWheelCenter,F as getWheelHandlePosition,S as getWheelValueFromInput,R as resolveSvgUrl,T as getSvgArcPath,E as iroColorPickerOptionDefaults};
//# sourceMappingURL=iro-core.es.js.map