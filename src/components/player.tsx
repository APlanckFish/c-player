import * as React from 'react';
import './player.scss'
// import { clearInterval } from 'timers';
 // eslint-disable-next-line
// import * as danmaku from 'danmaku'
// import * as DanmukuCanvas from '../utils/DanmukuCanvas'
let danmus = [
    {
        showTime: '5',//出现时间s
        mode: 'top',//顶端弹幕
        fontSize: '12',//默认弹幕字号
        fontColor: '#000000',//默认弹幕颜色
        unix: '1563155107',//时间戳
        pool: 0,//弹幕池 0普通 1字幕 2特殊
        sendId: 0,//发送者id
        content: '测试弹幕',//内容
    },{
        showTime: '2',//出现时间s
        mode: 'top',//顶端弹幕
        fontSize: '12',//默认弹幕字号
        fontColor: '#000000',//默认弹幕颜色
        unix: '1563155107',//时间戳
        pool: 0,//弹幕池 0普通 1字幕 2特殊
        sendId: 0,//发送者id
        content: '测试弹幕2',//内容
    }
]

interface playerShape {
    height: number,
    width: number,
    src: string,
    controls: boolean,
    poster: string
}
interface stateShape{
    video: HTMLVideoElement | null,
    // canvas: DanmuViewer | null
    canvas: HTMLCanvasElement | null
}

class Player extends React.Component<playerShape,stateShape> {
    constructor (props:playerShape) {
        super(props);
        this.state={
            video: null,
            canvas: null
        };
    }
    static defaultProps = {
        height: 360,
        width: 480,
        controls: false
    }
    componentDidMount () {
        const video: HTMLVideoElement | null = document.querySelector('#video');
        this.setState({
            video: video
        })
        // console.log(document.getElementById('0'),'000000000')
        // debugger
        // for (let danmu of danmus){
        //     let danmuText: HTMLElement | null = document.getElementById(danmu.id)
        //     if(danmuText){
        //         danmuText.style.animationDelay=danmu.showTime
        //         danmuText.style.fontSize=danmu.fontSize
        //         debugger
        //     }
        // }
        // let danmuViewer = new DanmuViewer(danmus);
        // this.setState({
        //     canvas: danmuViewer
        // })
        // danmuViewer.draw();
        // const danmaku = new Danmaku();
    }
    play () {
        // const video: HTMLVideoElement | null = document.querySelector('#video');
        if(this.state.video){
            this.state.video.play()
            // for(let danmu of danmus){
            //     if(this.state.canvas){
            //         this.state.canvas.shoot(danmu)
            //     }
            // }
        }
        // if(this.state.canvas){
        //     this.state.canvas.controler()
        // }
    }
    pause () {
        if(this.state.video){
            this.state.video.pause()
        }
        // if(this.state.canvas){
        //     this.state.canvas.pause()
        // }
    }
    fullScreen () {
        if(this.state.video){
            this.state.video.requestFullscreen();
        }
    }
    render() {
        //  
        // let danmuElement:Array<any> = []
        // for (let danmu of danmus){
        //     danmuElement.push(
        //         <div key={danmu.content} className="danmu danmuStyle" id={danmu.id}>{danmu.content}</div>
        //     )
        // }
        return (
            <div className="videoView">
                <video height={this.props.height} width={this.props.width} controls={this.props.controls} src={this.props.src} poster={this.props.poster} id="video"></video>
                <div className="controlBar">
                    <div className="playBtn" onClick={this.play.bind(this)}></div>
                    <div onClick={this.fullScreen.bind(this)}>全屏</div>
                    <div onClick={this.pause.bind(this)}>暂停</div>
                    {/* <i className="iconfont icon-play"/> */}
                </div>
                {/* <div className="danmuView">{danmuElement}</div> */}
                {/* <canvas id="canvas" className="danmuView" width={this.props.width} height={this.props.height}></canvas> */}
                <Danmuku></Danmuku>
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
    private duration: number;
    private canvasWidth: any;
    private canvasHeight: any;
    private scale: number;
    private danmus: Array<any>;
    private col: number;
    // private colTop: number;
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
        // this.colTop = parseInt((this.col * 2) / 3, 10);
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
            // debugger
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
          return danmukuData;
        });
        this.danmus = this.danmus.concat(newDanmuku);
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
                speed: (distance / scale) / ((this.duration / 1000) * 33),
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
        danmuku: [{
            content: 'test',
            date: 17,
            timePoint: 1,
            fontSize: 12,
            model: 'top'
        }],
        playerAction: 1,
        currentTime: false,
        loading: false,
        duration: 10,
        // dc: new DanmuViewer2(this.canvas,10)
    }
    componentDidMount(){
      // debugger
        // this.props.dc = new DanmuViewer2(10);
        this.canvas=document.querySelector('#canvas')
        // debugger
        if(this.canvas){
          this.dc=new DanmuViewer2(this.canvas,10)
        }
        if(this.dc){
          this.dc.draw();
        }
        this.runDanmuku();
    }
    // shouldComponentUpdate(nextProps) {
    //     if (nextProps.currentTime !== this.props.currentTime) {
    //       this.runDanmuku();
    //       return true;
    //     }
    //     if (nextProps.playerAction !== this.props.playerAction) {
    //       if (nextProps.playerAction === 1) {
    //         this.drawDanmuku();
    //       } else if (nextProps.playerAction === 2) {
    //         this.stopDanmuku();
    //       }
    //       return true;
    //     }
    //     return false;
    //   }
    runDanmuku(){
      const { danmuku, playerAction, currentTime, loading } = this.props;
      if (playerAction === 1 && !loading) {
        const data =
        danmuku.filter(d => (Math.round(d.timePoint) === Math.round(currentTime)));
          if(this.dc){
            this.dc.addDanmuku(data);
            this.dc.draw();
          }
        }
    }
    render() {
      return (
        <canvas id="canvas" className="danmuView" ref={node =>{this.canvas=node}}></canvas>
      )
    }
}

export default Player;