这是一个基于TypeScript的弹幕视频播放器。

![demo](E:\program\c-player\demo.png)

展示地址https://APlanckFish.github.io/c-player。**由于该项目托管在github服务器，强烈建议使用VPN代理访问，否则可能导致网络超时，视频无法正常加载等情况。**

## 初始化

组件导入后可直接引用。

````react
const App: React.FC = () => {
  return (
    <div className="App">
      <div className="title">C-player</div>
      <div className="subTitle">一个基于typescript的弹幕播放器</div>
      <header className="App-header">
        <Player src={videos} poster={poster} danmuku={danmuku}></Player>
      </header>
    </div>
  );
}
````

弹幕格式如下

```javascript
var danmu = {
    contnet: '测试弹幕',//内容
    date: new Date(),//日期
    timePoint: 1.0323,//出现时间
    fontSize: 'middle',//字体大小 small middle large 或者输入字号
    fontColor: 'white',//字体颜色 或者输入 #000000
    model: 'roll'//模式分为 top,roll.bottom
}
```

此项目为静态页面。只包含前端部分，不涉及后端交互。