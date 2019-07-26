import * as React from 'react';
import Video from './video'
import Danmuku from '../utils/danmuku'
import './player.scss'
import Slider from 'antd/es/slider';
import Input from 'antd/es/input'


interface playerShape {
    height: number,
    width: number,
    src: string,
    controls: boolean,
    poster: string,
    danmuku: Array<any>
}
interface stateShape{
    // video: HTMLVideoElement | null,
    video:{
      playTimes: number,
      duration: number,
      currentTime: number,
      bufferedTime: number,
      // volume: number,
      muted: boolean,
      // loop: boolean,
      width: number,
      height: number,
      volume: number
    }
    playerAction: number,
    playerStatus: number,
    // canvas: DanmuViewer | null
    canvas: HTMLCanvasElement | null,
    duration: number,
    process: number,
    danmuInput: string,
    danmuku: Array<any>
}

interface videoMetaData{
  duration: number,
  width: number,
  height: number
}

class Player extends React.Component<playerShape,stateShape> {
    private video: Video | null
    private currentTimer: NodeJS.Timeout | null
    constructor (props:playerShape) {
        super(props);
        this.state={
            video: {
              playTimes: 0,             // 播放次数
              duration: 0,              // 时长
              currentTime: 0,           // 当前播放时间(s)
              bufferedTime: 0,        // 缓冲状态
              // volume: this.props.volume,
              muted: false,             // 是否关闭声音
              // loop: this.props.loop,  // 是否洗脑循环
              width: 480,
              height: 360,
              volume: 100
            },
            playerAction: 0, // 0: 等待  1: 播放 2: 暂停  3: 拖放前进 4: 播放完毕
            playerStatus: 0,
            canvas: null,
            duration: 0,
            process: 0,
            danmuInput: '',
            danmuku: []
        };
        this.video=null;
        this.currentTimer=null;
    }
    static defaultProps = {
        height: 360,
        width: 480,
        controls: false
    }
    componentDidMount () {
      if(this.props.danmuku){
        this.setState({
          danmuku: this.props.danmuku,
        })
        console.log(this.state.danmuku,'danmuku')
      }
    }

    play () {
      const { video } = this.state;
      this.setState({
        playerAction: 1
      })
      if(this.video){
        this.video.play();
      }
      this.startCurrentTimer();
    }
    pause () {
        this.setState({ playerAction: 2 });
        if(this.video){
          this.video.pause();
          this.clearCurrentTimer();
        }
    }
    fullScreen () {
        // if(this.state.video){
        //     this.state.video.requestFullscreen();
        // }
    }
    handleOnLoadedMetadata = (metaData:videoMetaData) => {
      if (this.state.video&&this.state.video.playTimes === 0) {
        this.setState({
          video: Object.assign(this.state.video, { duration: metaData.duration }),
        });
        console.log(this.state.video.duration,'duration')
      }
      this.setState({
        video: Object.assign(this.state.video, {width: metaData.width})
      })
      this.setState({
        video: Object.assign(this.state.video, {height: metaData.height})
      })
    }
    handleOnLoadStart() {
    }
    handleOnLoadedData() {

    }
    handleOnCanPaly() {

    }
    handleOnWaiting() {

    }
    handleOnError() {

    }
    handleOnEneded =() => {
      this.setState({
        playerStatus: 3,
        playerAction: 2,
      });
    }
    setCurrentTime(time:number) {
      this.setState({
        playerAction: 3,
        video: Object.assign(this.state.video, { currentTime: time }),
      });
      if(this.video){
        this.video.setCurrentTime(time);
      }
      this.setState({
        playerAction: 1,
      });
    }
    startCurrentTimer = () => {   // 当前播放时间计时器
      if (this.currentTimer) {
        return;
      }
      this.currentTimer = setInterval(() => {
        if(this.video){
          this.setState({
            video: Object.assign(this.state.video, { currentTime: this.video.getCurrentTime() }),
          });
        }
        this.setState({
            process: (this.state.video.currentTime/this.state.video.duration)*100
        })
      }, 1000);
    }
  
    clearCurrentTimer = () => {   // 清除播放时间计时器
      if(this.currentTimer){
        clearInterval(this.currentTimer);
      }
      this.currentTimer = null;
    }
    formatTime (s:number) {
      let t:string = '';
      if(s>-1){
        // let hour = Math.floor(s/3600);
        let min = Math.floor(s/60) % 60;
        let sec = s % 60;
        // debugger
        // if(hour<10){
        //   t='0'+hour+':';
        // }else{
        //   t= hour+':';
        // }
        if(min<10){
          t+="0";
        }
        t+=min+':';
        if(sec<10){
          t+='0';
        }
        // t+=sec.toFixed(0)
        t+=Math.floor(sec);
      }
      return t
    }
    handleSliderChange (process:any) {
      let currentTime = (process/100)*this.state.video.duration
      if(this.video){
        this.video.setCurrentTime(currentTime)
      }
      this.setState({
        video: Object.assign(this.state.video, { currentTime: currentTime }),
        process: process
      })
    }
    changeInput (event:any) {
      this.setState({
        danmuInput: event.target.value
      })
    }
    changeVolume (event:any) {
      // console.log(event,'event')
      this.setState({
        video: Object.assign(this.state.video, { volume: event }),
      })
      if(this.video){
        this.video.setVolume(event/100)
      }
      console.log(this.state.video.volume,'volume')
    }
    sendDanmu () {
      console.log(this.state.danmuInput,'danmu')
      let obj = {
        content: this.state.danmuInput,
        date: new Date(),
        timePoint: this.state.video.currentTime+0.5,
        fontSize: 'middle',
        fontColor: 'white',
        model: 'roll'
      }
      let nd = this.state.danmuku
      nd.push(obj);
      this.setState({
        danmuku: nd,
        danmuInput: ''
      })
    }
    render() {
        return (
            <div className="videoView">
                <Video handleOnLoadedMetadata={this.handleOnLoadedMetadata} src={this.props.src} poster={this.props.poster} handleOnLoadStart={this.handleOnLoadStart} handleOnLoadedData={this.handleOnLoadedData} handleOnCanPaly={this.handleOnCanPaly} handleOnWaiting={this.handleOnWaiting} handleOnError={this.handleOnError} ref={node=>{this.video=node}}></Video>
                <div className="processDiv">
                  <div className="processBack"></div>
                  <Slider value={this.state.process} onChange={this.handleSliderChange.bind(this)} min={0} max={100} className="processSlider"/>
                </div>
                <div className="controlBar">
                    {/* <div className="playBtn" onClick={this.play.bind(this)}></div> */}
                    {this.state.playerAction==1?<i className="icon-zanting iconfont" onClick={this.pause.bind(this)}></i>:<i className="icon-play iconfont" onClick={this.play.bind(this)}></i>}
                    <div className="currentTime">{this.formatTime(this.state.video.currentTime)}/</div>
                    <div className="duration">{this.formatTime(this.state.video.duration)}</div>
                    <Input placeholder="发个弹幕吐槽吧！" className="danmuInput" value={this.state.danmuInput} onChange={this.changeInput.bind(this)} onPressEnter={this.sendDanmu.bind(this)}></Input>
                    <div className="voiceDiv">
                      <i className="iconfont icon-yinliang"></i>
                      <Slider vertical value={this.state.video.volume} onChange={this.changeVolume.bind(this)} className="voiceSlider"/>
                      <div className="voiceBack"></div>
                    </div>
                    {/* <div onClick={this.fullScreen.bind(this)}>全屏</div> */}
                </div>
                {/* <div className="danmuView">{danmuElement}</div> */}
                {/* <canvas id="canvas" className="danmuView" width={this.props.width} height={this.props.height}></canvas> */}
                <Danmuku currentTime={this.state.video.currentTime} duration={this.state.video.duration} playerAction={this.state.playerAction} width={this.state.video.width} height={this.state.video.height} danmuku={this.state.danmuku}></Danmuku>
            </div>
        );
    }
}
interface danmukuProps{
    danmuku: Array<danmukuContent>;
    playerAction: number;
    currentTime: number;
    loading: boolean;
    duration: number;
    width: number,
    height: number
    // dc:any;
}
interface danmukuContent{
    content: string,
    date: string,
    timePoint: number,
    fontSize: any,
    model: string
}

export default Player;