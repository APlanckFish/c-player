import * as React from 'react';

interface danmukuContent{
    content: string,
    date: string,
    timePoint: number,
    fontSize: any,
    model: string
}

class DanmuViewer{
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

export default DanmuViewer