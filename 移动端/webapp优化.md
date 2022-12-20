
# 云隐 - https://applnzi6vl27059.pc.xiaoe-tech.com/live_pc/l_63490943e4b0eca59c3dfc45

#### 三、JS API
1. 窗口类
orientationchange - 手机是否是横屏的状态
```js
    screenOrientation: function() {
        let self = this;
        let orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;

        window.addEventlistener(
            'onorientationchange' in window ? "oorientationchange" : "resize",
            function() {
                self.angle = orientation.angle;
                // 样式调整
                // 参数切换
            }
        )
    }

    // 竖屏
    @media screen and (orientation: potrait) {
        // ……
    }

    // 横屏
    @media screen and (orientation: landscape) {
        // ……
    }
```

navigator.language - 语言
```js
    this.lang = navigator.language;

    function getThisLang() {
        const langList = ['cn', 'tw', 'en', 'fr'];
        const langListLen = langList.length;
        const thisLang = (
            navigator.language || navigator.browserLanguage
        ).toLowerCase();

        for (let i = 0; i < langListLen; i++) {
            let lang = langList[i];
            if (thisLang.includes(lang)) {
                return lang;
            } else {
                return 'en';
            }
        }
    }
```

Element.requestFullscreen() - 全屏
```js
    fullScreenFun: function() {
        let self = this;
        let fullscreenEnabled
            = document.fullscreenEnabled
            || document.mozFullscreenEnabled
            || document.webkitFullscreenEnabled
            || document.msFullscreenEnabled

        if (fullscreenEnabled) {
            let de = document.documentElement;

            if (self.fullScreenInfo === 'full') {
                if (de.requestFullscreen) {
                    de.requestFullscreen();
                } else if (de.mozRequestFullscreen) {
                    de.mozRequestFullscreen();
                } else if (de.webkitRequestFullscreen) {
                    de.webkitRequestFullscreen();
                }
                self.fullScreenInfo = 'quitFull'
            } else {
                if (de.exitFullscreen) {
                    de.exitFullscreen();
                } else if (de.mozExitFullscreen) {
                    de.mozExitFullscreen();
                } else if (de.webkitExitFullscreen) {
                    de.webkitExitFullscreen();
                }
                self.fullScreenInfo = 'full'
            }
        } else {
            // ……
        }
    }
```

2. 硬件类
navigator.getBattery() - 获取电池状态
```js
    getBatteryInfo: function() {
        let self = this;

        if (navigator.getBattery) {
            navigator.getBattery().then(function(battery) {
                self.batteryInfo
                    = battery.charging
                        ? '在充电'
                        : '不在充电';
                console.log(`剩余电量：${battery.level}%`）

                battery.addEventListener('chargingchange', function() {
                    self.batteryInfo
                        = batter.charging
                            ? '在充电'
                            : '不在充电';
                })
            })
        } else {
            // 不支持状态读取
        }
    }
```

window.navigator.vibrate() - 振动
```js
    vibrateFun: function() {
        let self = this;
        if (navigator.vibrate) {
            navigator.vibrate(200);
            navigator.vibrate([200, 200, 200, 200, 200]);
        } else {
            // 不支持振动
        }
        navigator.vibrate(0);

        setInterval(function() {
            navigator.vibrate(200);
        }, 500)
    }
```

navigartor.onLine - 网络状态
```js
    mounted() {
        let self = this;
        window.addEventListener('online', onlineChanged);
        window.addEventListener('offline', offlinechanged);
    },
    methods: {
        onlineChanged() {
            // 在线时操作
        },
        offlinechanged() {
            // 离线时操作
        }
    }
```

#### 四、移动优化
1. 图片优化
a. 图片类型选择优化

JPG / JPEG - 有损压缩型、体积小加载快、不支持透明
特长 - 大图片、展示色彩丰富的图片。如：轮播、banner、标题图
缺点 - 不支持透明处理、压缩有模糊

PNG - 无损压缩、质量高、体积大、支持可透明
特长 - 色彩表现力的图片，对线条处理更细腻。如：复杂图形、logo
缺点 - 体积大

svg - 文本文件、体积小、不失真、兼容性好
特点 - 不是基于像素点灰阶，而是基于图形的代码描述。如：icon
缺点 - 渲染成本较高，特别是复杂图形


b. 根据网络优化
对图片url进行预处理 xxxx/ x3 /zhaowa.png
按照质量纬度进行优化 - 弱网环境下，使用低质量图片
按照尺寸纬度进行优化 - 移动端默认加载小图片进行缩放展示

c. 图片懒加载优化
通过data-src和src的切换，实现动态懒加载 - 瀑布流课程有讲解 ***

d. CDN请求数进行优化
较大体积的图片 - 直接传到CDN
单色图标iconfont、svg图片 - 放置在本地
标签类的图片较小且繁多 - 生成雪碧图之后，上传到CDN
图片体积小于10kb，结合使用场景 - base64

e. 大图检测
加载图片上报告警，超过阈值做告警，更换小图片。

f. 上传压缩
上传图片前，走压缩平台处理

canvas - 图表

2. CSS性能优化
a. 选择器类型优化
```js
    // 减少使用类选择器以及id选择器去重复修饰元素标签 CSSOM layout-tree
    footer #footer .footer {}
    // 标签尽量一定位的方式结合标签本身的即便来做定位
```

b. 选择器书写优化
```js
    .footer .footer-item-container .footer-item .footer-link .footer-img {
        width: 100%;
    }
    .yy-img {
        // 嵌套少
        // 权重低 - 计算少，便于使用覆盖
        width: 100%
    }

    // CSS解析的顺序是从右往左的
```

c. 避免使用通配符
```js
    * {
        padding: 0;
    }
```

d. 注释不如直接删掉
```js
    .footer {
        // 移出无用样式
        // width: 100%;
    }
```

e. 减少使用高级选择器，性能开销大
```js
    [class*="footer-indicator"] {}
    [class~="footer-indicator"] {}
```

f. 优化统一选择器
```js
    .footer {
        display: flex;
    }
    .footer-item {
        display: flex;
    }

// =>
    .flex-display {
        display: flex;
    }
```

g. 优化统一属性
```js
    .footer {
        margin-top: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        margin-left: 10px;

        margin: 10px 20px 10px 20px;
        margin: 10px 20px;

        background-color: #fff;

        font-size: 12px;
    }
    
```

h. 写法优化上
避免@import引用加载CSS  => scss除外
做动画的时候CSS3，其次再去考虑js动画
移动端优先考虑flex布局，减少float

3. DOM性能优化
a. 渲染优化 - 减少DOM元素数量和嵌套层级
=> 虚拟列表
