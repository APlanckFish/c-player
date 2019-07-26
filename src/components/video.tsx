import React, { Component } from 'react';

interface videoProps{
    src: string,
    loop: boolean,
    preload: string,
    poster: string,
    handleOnLoadStart: ()=> void,
    handleOnLoadedMetadata: (metaData:videoMetaData)=> void,
    handleOnLoadedData: ()=> void,
    handleOnCanPaly: ()=> void,
    handleOnWaiting: ()=> void,
    handleOnError: (error: MediaError)=> void,
}

interface videoMetaData{
    duration: number,
    width: number,
    height: number
}

export default class Video extends Component<videoProps> {
    static displayName = 'cPlayer';
    private video: HTMLVideoElement | null;
    static defaultProps = {
      autoPlay: false,
      preload: 'auto',
      loop: false,
      volume: 0.8,
      controls: true,
    };
  
    constructor(props:videoProps) {
      super(props);
      this.video = null;
    }
  
    shouldComponentUpdate(nextProps:videoProps) {
      return nextProps.src !== this.props.src;
    }
  
    onLoadStart = () => {
      this.props.handleOnLoadStart();
    }
  
    onLoadedMetaData = () => {
      if(this.video){
          const obj = {
            duration: this.video.duration,
            width: this.video.clientWidth,
            height: this.video.clientHeight
          }
          this.props.handleOnLoadedMetadata(obj);
      }
    }
  
    onLoadedData = () => {
      this.props.handleOnLoadedData();
    }
  
    onWaiting = () => {
      this.props.handleOnWaiting();
    }
  
    onCanPlay = () => {
      this.props.handleOnCanPaly();
    }
  
    onError = () => {
      if(this.video){
          const error = this.video.error;
          if(error){
              this.props.handleOnError(error);
          }
      }
    }
  
    getBuffered = () => {
      if(this.video){
          const { buffered } = this.video;
          let end = 0;
          try {
            end = buffered.end(0) || 0;
            end = ((end * 1000) + 1) / 1000;
          } catch (e) {
            // continue regardless of error
          }
          return end;
      }
    }
  
    getCurrentTime = () => {
        if(this.video){
            return  this.video.currentTime;
        }
    }
  
    setCurrentTime = (time:number) => {
      if(this.video){
          this.video.currentTime = time;
      }
    }
  
    setLoop = (loop:boolean) => {
      if(this.video){
          this.video.loop = loop;
      }
    }
  
    setMuted = (muted:boolean) => {
      if(this.video){
          this.video.muted = muted;
      }
    }
  
    setVolume = (volume:number) => {
      if(this.video){
          this.video.volume = volume;
      }
    }
  
    play = () => {
      if(this.video){
          this.video.play();
      }
    }
  
    pause = () => {
      if(this.video){
          this.video.pause();
      }
    }
  
    render() {
      return (
        <video
          className="react-video"
          src={this.props.src}
          loop={this.props.loop}
          preload={this.props.preload}
          poster={this.props.poster}
          ref={node => (this.video = node)}
  
          onCanPlay={this.onCanPlay}
          onError={this.onError}
          onLoadStart={this.onLoadStart}
          onLoadedMetadata={this.onLoadedMetaData}
          onLoadedData={this.onLoadedData}
          onWaiting={this.onWaiting}
        //   onProgress={this.onProgress}
        //   onPlay={this.onPlay}
        //   onEnded={this.handleOnEnded}
        />
      );
    }
}