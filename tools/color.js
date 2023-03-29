
// 生成随机十六进制
const randomHexColor = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")}`
console.log(randomHexColor());

//************** 颜色 16进制 转换 RGB 值 ***************//
const rgb2hex = ([r, g, b]) =>
`#${(1 << 24) + (r << 16) + (g << 8) + b}`.toString(16).substr(1);
console.log('#' + rgb2hex([76, 11, 181]));
// #4c0bb5

const hex2rgb = hex =>
[1, 3, 5].map((h) => parseInt(hex.substring(h, h + 2), 16));
console.log('RGB(' + hex2rgb("#4c0bb5") + ')');
// [76, 11, 181]