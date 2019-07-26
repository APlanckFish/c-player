import React from 'react';
import './App.css';
import Player from './components/player';
// import poster from './assets/test.jpg'
// import videos from './assets/video.mp4'

// const videos = require('./assets/video.mp4')
const poster = require('./assets/test.jpg')
const videos = require('./assets/video2.mp4')
let danmuku:Array<any>;
danmuku= [];

function generateDanmu () {
  for(let i=0; i < 100; i++){
    let r = Math.random()
    let obj = {
      content: '测试弹幕',
      date: new Date(),
      timePoint: r*10,
      fontSize: 'middle',
      fontColor: 'white',
      model: 'roll'
    }
    if(r<0.5){
      obj.model='top'
    }
    obj.fontColor='#' + Math.floor(r * 0xffffff).toString(16)
    danmuku.push(obj)
  }

}
generateDanmu ()
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


export default App;
