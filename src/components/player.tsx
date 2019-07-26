import * as React from 'react';
import Video from './video'
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

class DanmuViewer{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private barrageList: Array<any>;
    private w:  number;
    private h:  number;
    private animationId: number ;
    private currentVideoTime: number;
    private timer: any;
    private danmus: Array<any>;
    private isPlay: boolean;

    constructor(danmus:Array<any>) {
        let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.canvas = canvas;
        let ctx = this.canvas.getContext('2d');
        let rect = this.canvas.getBoundingClientRect();
        this.w = rect.right - rect.left;
        this.h = rect.bottom - rect.top;
        this.animationId=0;
        this.currentVideoTime=0;
        this.isPlay=false;
        if(ctx){
            this.ctx = ctx
            this.ctx.font = '20px Microsoft YaHei';
        }else{
            this.ctx = null
        }
        this.barrageList = [];
        this.danmus = danmus;
    }
    
    //canvas绘制文字x,y坐标是按文字左下角计算，预留30px
    getTop() {
        return Math.floor(Math.random() * (this.h - 30)) + 30;
    }

    //获取偏移量
    getOffset() {
        return +(Math.random() * 4).toFixed(1) + 1;
    }

    //获取随机颜色
    getColor() {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
    }
    //绘制文字
    drawText(barrage:any) {
        if(this.ctx){
            this.ctx.fillStyle = barrage.color;
            this.ctx.fillText(barrage.value, barrage.left, barrage.top);
        }
    }
    //添加弹幕列表
    shoot(value:any) {
        let top = this.getTop();
        let color = this.getColor();
        let offset = this.getOffset();
        let width;
        if(this.ctx){
             width = Math.ceil(this.ctx.measureText(value).width);
        }else{
             width = 0
        }

        let barrage = {
            value: value.content,
            top: top,
            left: this.w,
            color: color,
            offset: offset,
            width: width
        }
        this.barrageList.push(barrage);
    }

    //开始绘制
    draw() {
        if (this.barrageList.length) {
            if(this.ctx){
                this.ctx.clearRect(0, 0, this.w, this.h);
            }
            for (let i = 0; i < this.barrageList.length; i++) {
                let b = this.barrageList[i];
                if (b.left + b.width <= 0) {
                    this.barrageList.splice(i, 1);
                    i--;
                    continue;
                }
                b.left -= b.offset;
                this.drawText(b);
            }
        }
        this.animationId=requestAnimationFrame(this.draw.bind(this));
        if(this.ctx){
            this.ctx.restore();
        }
    }

    pause() {
        // cancelAnimationFrame(this.animationId);
        // console.log(this.timer,'timer')
        // clearInterval(this.timer);
        // this.isPlay=false;
        if(this.ctx){
            this.ctx.save();
        }
    }

    controler() {
        let that = this;
        this.timer=setInterval(()=>{
            if(that.danmus.length){
                for (let danmu of that.danmus){
                    if(danmu.showTime==that.currentVideoTime){
                        that.shoot(danmu)
                    }
                }
            }
            that.currentVideoTime+=1;
        },1000)
        this.isPlay=true;
    }
}

class DanmuViewer2{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    public duration: number;
    public canvasWidth: any;
    public canvasHeight: any;
    private scale: number;
    private danmus: Array<any>;
    private col: number;
    private colTop: number;
    private cols: Array<any>;
    private topCols: Array<any>;
    private bottomCols: Array<any>;
    private timer?: NodeJS.Timer | null;

    constructor(canvas1: HTMLCanvasElement,duration:number){
        // let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        let canvas = canvas1;
        this.canvas = canvas;
        let ctx = this.canvas.getContext('2d');
        this.ctx = ctx;
        this.scale=0;
        this.fixCanvas(canvas);
        this.duration = duration;
        this.clearCanvas();
        this.danmus = [];
        this.col = Math.floor(canvas.height / 30);
        this.colTop = (this.col * 2) / 3;
        this.cols = new Array(this.col).fill(true);
        this.topCols = new Array(this.col).fill(true);
        this.bottomCols = new Array(this.col).fill(true);

        const container:any = canvas.parentNode;
        if(container){
            const w = container.clientWidth;
            const h = container.clientHeight;
            this.canvasWidth = w;
            this.canvasHeight = h;
            canvas.width = w;
            canvas.height = h;
            canvas.style.width = w;
            canvas.style.height = h;
        }
    }
    draw = () => {
        // if (!this.isSupport) {
        //   return;
        // }
        console.log(this.danmus,'danmus')
        if (this.timer) {
          return;
        }
        this.timer = setInterval(() => {
        if(this.ctx){
            this.clearCanvas();
            this.ctx.save();
            const arr = this.danmus;
            for (let i = 0, len = arr.length; i < len; i += 1) {
              if (arr[i].status) {
                const { content, x, y } = arr[i];
                this.ctx.fillStyle = arr[i].fontColor;
                this.ctx.font = this.getFont(arr[i].fontSize);
                this.ctx.fillText(content, x, y);
                if (arr[i].insert) {
                  this.ctx.strokeStyle = 'white';
                  this.ctx.lineCap = 'square';
                  this.ctx.beginPath();
                  this.ctx.moveTo(x, y + 3);
                  this.ctx.lineTo(x + (arr[i].textWidth / this.scale), y + 3);
                  this.ctx.stroke();
                  this.ctx.closePath();
                }
                switch (arr[i].model) {
                  case 'roll':
                    this.danmus[i].x = arr[i].x - arr[i].speed;
                    if (arr[i].x <= -(arr[i].textWidth)) {
                      this.danmus[i].status = false;
                    }
                    if (arr[i].x + arr[i].textWidth < (this.canvas.width * (4 / 5)) && arr[i].status) {
                      this.cols[arr[i].col - 1] = true;
                    }
                    break;
                  case 'top':
                    // debugger
                    this.danmus[i].current = this.danmus[i].current + 30;
                    if (arr[i].current >= this.duration) {
                      this.danmus[i].status = false;
                      this.topCols[arr[i].col - 1] = true;
                    }
                    break;
                  case 'bottom':
                    this.danmus[i].current = this.danmus[i].current + 30;
                    if (arr[i].current >= this.duration) {
                      this.danmus[i].status = false;
                      this.bottomCols[this.bottomCols.length - arr[i].col] = true;
                    }
                    break;
                  default:
                    this.danmus[i].x = arr[i].x - arr[i].speed;
                    if (arr[i].x <= -(arr[i].textWidth)) {
                      this.danmus[i].status = false;
                    }
                    if (arr[i].x + arr[i].textWidth < this.canvasWidth - 33 && arr[i].status) {
                      this.cols[arr[i].col - 1] = true;
                    }
                    break;
                }
              }
            }
            this.ctx.restore();
            this.refreshDanmuku();
            }
        }, 30);
      };
      refreshDanmuku = () => {
        for (let i = 0; i < this.danmus.length; i += 1) {
          if (!this.danmus[i].status) {
            this.danmus.splice(i, 1);
          }
        }
      };
      
      clearCanvas = () => {
        if(this.ctx){
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
      };
      fixCanvas = (t:any) => {
        const i = t.getContext('2d');
        const n = window.devicePixelRatio || 1;
        const e = i.webkitBackingStorePixelRatio || i.mozBackingStorePixelRatio ||
          i.msBackingStorePixelRatio || i.oBackingStorePixelRatio || i.backingStorePixelRatio || 1;
        const a = n / e;
        if (n !== e) {
          const o = t.width;
          const r = t.height;
          t.width = o * a;
          t.height = r * a;
          this.canvasWidth = o * a;
          this.canvasHeight = o * a;
          t.style.width = `${o}px`;
          t.style.height = `${r}px`;
          i.scale(a, a);
        }
        this.scale = a;
      };
      getFont = (size:string) => {
        let ratio;
        switch (size) {
          case 'small':
            ratio = '14';
            break;
          case 'middle':
            ratio = '20';
            break;
          case 'large':
            ratio = '26';
            break;
          default:
            ratio = '20';
            break;
        }
        return `${ratio}px Arial normal`;
      };
      addDanmuku = (data:Array<any>) => {
        const newDanmuku = data.map((d) => {
          const danmukuData = this.formatData(d, false);
          // debugger
          return danmukuData;
        });
        this.danmus = this.danmus.concat(newDanmuku);
      }
      insertDanmuku = (danmu:danmukuContent) => {
        const data = this.formatData(danmu, true);
        this.danmus.push(data);
      }
      stop = () => {
        if(this.timer){
          clearInterval(this.timer);
        }
        this.timer = null;
      }
      formatData = (data:danmukuContent, insertFlag:any) => {
        let positionX;
        let randomCol = 0;
        const cols = this.cols;
        const topCols = this.topCols;
        const bottomCols = this.bottomCols;
        if(this.ctx){
            this.ctx.font = this.getFont(data.fontSize);
            const scale = this.scale;
            const tw = this.ctx.measureText(data.content).width * scale;
            const distance = tw + this.canvas.width;
            // debugger
            if (data.model === 'roll') {
              for (let i = 0; i < cols.length; i += 1) {
                if (cols[i]) {
                  randomCol = i + 1;
                  this.cols[i] = false;
                  break;
                }
                if (i === cols.length - 1) {
                  const random = ((Math.random() * (this.col - 1)) + 1);
                  randomCol = random;
                  this.cols[random - 1] = false;
                }
              }
              positionX = this.canvas.width / scale;
            } else if (data.model === 'top') {
              for (let i = 0; i < topCols.length; i += 1) {
                if (topCols[i]) {
                  randomCol = i + 1;
                  this.topCols[i] = false;
                  break;
                }
                if (i === topCols.length - 1) {
                  const random = ((Math.random() * (this.col - 1)) + 1);
                  randomCol = random;
                  this.topCols[random - 1] = false;
                }
              }
              positionX = ((this.canvas.width - tw) / 2) / scale;
            } else if (data.model === 'bottom') {
              const len = bottomCols.length;
              for (let i = 0; i < len; i += 1) {
                if (bottomCols[i]) {
                  randomCol = len - i;
                  this.bottomCols[i] = false;
                  break;
                }
                if (i === topCols.length - 1) {
                  const random = ((Math.random() * (this.col - 1)) + 1);
                  randomCol = random;
                  this.bottomCols[random - 1] = false;
                }
              }
              positionX = ((this.canvas.width - tw) / 2) / scale;
            }
            const danmukuData =
            Object.assign(
              {},
              data,
              {
                x: positionX,
                y: randomCol * 30,
                textWidth: tw,
                // speed: (distance / scale) / ((this.duration / 1000) * 33),
                speed: Math.random()*5+1,
                insert: insertFlag,
                current: 0,
                status: true,
                col: randomCol,
              },
            );
            return danmukuData;
        }
      };
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

class Danmuku extends React.Component<danmukuProps>{
    public canvas:HTMLCanvasElement | null
    public dc:DanmuViewer2 | null
    constructor (props:danmukuProps) {
        super(props)
        // if(!this.canvas){
        // this.canvas=document.querySelector('#canvas')
        this.canvas=null
        this.dc=null
        // }
    }
    static defaultProps = {
        // danmuku: [{
        //   content: 'test',
        //   date: new Date(),
        //   timePoint: 1,
        //   fontSize: 'middle',
        //   fontColor: 'white',
        //   model: 'roll'
        // },{
        //   content: 'test2',
        //   date: new Date(),
        //   timePoint: 1,
        //   fontSize: 'middle',
        //   fontColor: 'white',
        //   model: 'roll'
        // }],
        // playerAction: 1,
        // currentTime: 1,
        loading: false,
        // duration: 10,
        // dc: new DanmuViewer2(this.canvas,10)
    }
    componentDidMount(){
        // this.props.dc = new DanmuViewer2(10);
        this.canvas=document.querySelector('#canvas')
        console.log(this.props,'props')
        if(this.canvas){
          this.dc=new DanmuViewer2(this.canvas,this.props.duration)
        }
        if(this.dc){
          this.dc.draw();
        }
        // this.runDanmuku();
    }
    shouldComponentUpdate(nextProps:danmukuProps) {
        if(this.dc){
          this.dc.duration=nextProps.duration;
          this.dc.canvasHeight=nextProps.height;
          this.dc.canvasWidth=nextProps.width;
        }
        if(this.canvas){
          this.canvas.width=nextProps.width;
          this.canvas.height=nextProps.height;
        }
        if (nextProps.currentTime !== this.props.currentTime) {
          this.runDanmuku();
          return true;
        }
        if (nextProps.playerAction !== this.props.playerAction) {
          if (nextProps.playerAction === 1) {
            this.drawDanmuku();
          } else if (nextProps.playerAction === 2) {
            this.stopDanmuku();
          }
          return true;
        }
        return false;
      }
    runDanmuku(){
      const { danmuku, playerAction, currentTime, loading } = this.props;
      if (playerAction === 1 && !loading) {
        const data =
        danmuku.filter(d => (Math.round(d.timePoint) === Math.round(currentTime)));
        // danmuku.filter(d => (d.timePoint === currentTime));
        if(this.dc){
            this.dc.addDanmuku(data);
            this.dc.draw();
          }
        }
    }
    drawDanmuku() {
      const { playerAction, loading } = this.props;
      if (playerAction === 1 && !loading) {
        if(this.dc){
          this.dc.draw();
        }
      }
    }
    stopDanmuku() {
      if(this.dc){
        this.dc.stop();
      }
    }
    render() {
      return (
        <canvas id="canvas" className="danmuView" ref={node =>{this.canvas=node}} width={this.props.width} height={this.props.height}></canvas>
      )
    }
}

export default Player;