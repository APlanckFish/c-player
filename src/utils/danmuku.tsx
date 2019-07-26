import * as React from 'react';
import DanmuViewer from './danmuviewer'

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
    public dc:DanmuViewer | null
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
          this.dc=new DanmuViewer(this.canvas,this.props.duration)
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

export default Danmuku