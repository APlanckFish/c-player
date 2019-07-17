(function(t,i){typeof exports==="object"&&typeof module!=="undefined"?module.exports=i():typeof define==="function"&&define.amd?define(i):t.Danmaku=i()})(this,function(){"use strict";function u(t){var u=this;var m=this._hasMedia?this.media.currentTime:Date.now()/1e3;var c=this._hasMedia?this.media.playbackRate:1;function i(t,i){if(i.mode==="top"||i.mode==="bottom"){return m-t.time<u.duration}var e=u.width+t.width;var s=e*(m-t.time)*c/u.duration;if(t.width>s){return true}var n=u.duration+t.time-m;var h=u.width+i.width;var a=u._hasMedia?i.time:i._utc;var r=h*(m-a)*c/u.duration;var o=u.width-r;var d=u.duration*o/(u.width+i.width);return n>d}var e=this._space[t.mode];var s=0;var n=0;for(var h=1;h<e.length;h++){var a=e[h];var r=t.height;if(t.mode==="top"||t.mode==="bottom"){r+=a.height}if(a.range-a.height-e[s].range>=r){n=h;break}if(i(a,t)){s=h}}var o=e[s].range;var d={range:o+t.height,time:this._hasMedia?t.time:t._utc,width:t.width,height:t.height};e.splice(s+1,n-s-1,d);if(t.mode==="bottom"){return this.height-t.height-o%this.height}return o%(this.height-t.height)}function m(t){var i=document.createElement("div");i.style.cssText="position:absolute;";if(typeof t.render==="function"){var e=t.render();if(e instanceof HTMLElement){i.appendChild(e);return i}}if(t.html===true){i.innerHTML=t.text}else{i.textContent=t.text}if(t.style){for(var s in t.style){i.style[s]=t.style[s]}}return i}var c=function(){var t=["oTransform","msTransform","mozTransform","webkitTransform","transform"];var i=document.createElement("div").style;for(var e=0;e<t.length;e++){if(t[e]in i){return t[e]}}return"transform"}();function h(){var t=Date.now()/1e3;var i=this._hasMedia?this.media.currentTime:t;var e=this._hasMedia?this.media.playbackRate:1;var s=null;var n=0;var h=0;for(h=this.runningList.length-1;h>=0;h--){s=this.runningList[h];n=this._hasMedia?s.time:s._utc;if(i-n>this.duration){this.stage.removeChild(s.node);if(!this._hasMedia){s.node=null}this.runningList.splice(h,1)}}var a=[];var r=document.createDocumentFragment();while(this.position<this.comments.length){s=this.comments[this.position];n=this._hasMedia?s.time:s._utc;if(n>=i){break}if(this._hasMedia){s._utc=t-(this.media.currentTime-s.time)}s.node=s.node||m(s);this.runningList.push(s);a.push(s);r.appendChild(s.node);++this.position}if(a.length){this.stage.appendChild(r)}for(h=0;h<a.length;h++){s=a[h];s.width=s.width||s.node.offsetWidth;s.height=s.height||s.node.offsetHeight}for(h=0;h<a.length;h++){s=a[h];s.y=u.call(this,s);if(s.mode==="top"||s.mode==="bottom"){s.x=this.width-s.width>>1;s.node.style[c]="translate("+s.x+"px,"+s.y+"px)"}}for(h=0;h<this.runningList.length;h++){s=this.runningList[h];if(s.mode==="top"||s.mode==="bottom"){continue}var o=this.width+s.width;var d=o*(t-s._utc)*e/this.duration;d|=0;if(s.mode==="ltr")s.x=d-s.width;if(s.mode==="rtl")s.x=this.width-d;s.node.style[c]="translate("+s.x+"px,"+s.y+"px)"}}var d=Object.create(null);function l(t,i){if(d[t]){return d[t]}var e=12;var s=/^(\d+(?:\.\d+)?)(px|%|em|rem)(?:\s*\/\s*(\d+(?:\.\d+)?)(px|%|em|rem)?)?/;var n=t.match(s);if(n){var h=n[1]*1||10;var a=n[2];var r=n[3]*1||1.2;var o=n[4];if(a==="%")h*=i.container/100;if(a==="em")h*=i.container;if(a==="rem")h*=i.root;if(o==="px")e=r;if(o==="%")e=h*r/100;if(o==="em")e=h*r;if(o==="rem")e=i.root*r;if(o===undefined)e=h*r}d[t]=e;return e}function o(t,i){if(typeof t.render==="function"){var e=t.render();if(e instanceof HTMLCanvasElement){t.width=e.width;t.height=e.height;return e}}var s=document.createElement("canvas");var n=s.getContext("2d");var h=t.canvasStyle||{};h.font=h.font||"10px sans-serif";h.textBaseline=h.textBaseline||"bottom";var a=h.lineWidth*1;a=a>0&&a!==Infinity?Math.ceil(a):!!h.strokeStyle*1;n.font=h.font;t.width=t.width||Math.max(1,Math.ceil(n.measureText(t.text).width)+a*2);t.height=t.height||Math.ceil(l(h.font,i))+a*2;s.width=t.width;s.height=t.height;for(var r in h){n[r]=h[r]}var o=0;switch(h.textBaseline){case"top":case"hanging":o=a;break;case"middle":o=t.height>>1;break;default:o=t.height-a}if(h.strokeStyle){n.strokeText(t.text,a,o)}n.fillText(t.text,a,o);return s}function a(){this.stage.context.clearRect(0,0,this.width,this.height);var t=Date.now()/1e3;var i=this._hasMedia?this.media.currentTime:t;var e=this._hasMedia?this.media.playbackRate:1;var s=null;var n=0;var h=0;for(h=this.runningList.length-1;h>=0;h--){s=this.runningList[h];n=this._hasMedia?s.time:s._utc;if(i-n>this.duration){s.canvas=null;this.runningList.splice(h,1)}}while(this.position<this.comments.length){s=this.comments[this.position];n=this._hasMedia?s.time:s._utc;if(n>=i){break}if(this._hasMedia){s._utc=t-(this.media.currentTime-s.time)}s.canvas=o(s,this._fontSize);s.y=u.call(this,s);if(s.mode==="top"||s.mode==="bottom"){s.x=this.width-s.width>>1}this.runningList.push(s);++this.position}for(h=0;h<this.runningList.length;h++){s=this.runningList[h];var a=this.width+s.width;var r=a*(t-s._utc)*e/this.duration;if(s.mode==="ltr")s.x=r-s.width+.5|0;if(s.mode==="rtl")s.x=this.width-r+.5|0;this.stage.context.drawImage(s.canvas,s.x,s.y)}}var r=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(t){return setTimeout(t,50/3)};var t=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||clearTimeout;function s(){if(!this.visible||!this.paused){return this}this.paused=false;if(this._hasMedia){for(var t=0;t<this.runningList.length;t++){var i=this.runningList[t];i._utc=Date.now()/1e3-(this.media.currentTime-i.time)}}var e=this;var s=this._useCanvas?a:h;function n(){s.call(e);e._requestID=r(n)}this._requestID=r(n);return this}function e(){if(!this.visible||this.paused){return this}this.paused=true;t(this._requestID);this._requestID=0;return this}function n(t,i,e){var s=0;var n=0;var h=t.length;while(n<h-1){s=n+h>>1;if(e>=t[s][i]){n=s}else{h=s}}if(t[n]&&e<t[n][i]){return n}return h}function i(){var t=9007199254740991;return[{range:0,time:-t,width:t,height:0},{range:t,time:t,width:0,height:0}]}function f(t){t.ltr=i();t.rtl=i();t.top=i();t.bottom=i()}function p(){if(!this._hasMedia){return this}this.clear();f(this._space);var t=n(this.comments,"time",this.media.currentTime);this.position=Math.max(0,t-1);return this}function v(t){t.play=s.bind(this);t.pause=e.bind(this);t.seeking=p.bind(this);this.media.addEventListener("play",t.play);this.media.addEventListener("pause",t.pause);this.media.addEventListener("seeking",t.seeking)}function g(t){this.media.removeEventListener("play",t.play);this.media.removeEventListener("pause",t.pause);this.media.removeEventListener("seeking",t.seeking);t.play=null;t.pause=null;t.seeking=null}function w(t,i){var e=window.getComputedStyle(t,null).getPropertyValue("font-size").match(/(.+)px/)[1]*1;if(t.tagName==="HTML"){i.root=e}else{i.container=e}}function _(t){if(!/^(ltr|top|bottom)$/i.test(t)){return"rtl"}return t.toLowerCase()}function y(t){t.prototype.init=function(t){if(this._isInited){return this}if(!t||!t.container&&(!t.video||t.video&&!t.video.parentNode)){throw new Error("Danmaku requires container when initializing.")}this._hasInitContainer=!!t.container;this.container=t.container;this.visible=true;this.engine=(t.engine||"DOM").toLowerCase();this._useCanvas=this.engine==="canvas";this._requestID=0;this._speed=Math.max(0,t.speed)||144;this.duration=4;this.comments=t.comments||[];this.comments.sort(function(t,i){return t.time-i.time});for(var i=0;i<this.comments.length;i++){this.comments[i].mode=_(this.comments[i].mode)}this.runningList=[];this.position=0;this.paused=true;this.media=t.video||t.audio;this._hasMedia=!!this.media;this._hasVideo=!!t.video;if(this._hasVideo&&!this._hasInitContainer){var e=!this.media.paused;this.container=document.createElement("div");this.container.style.position=this.media.style.position;this.media.style.position="absolute";this.media.parentNode.insertBefore(this.container,this.media);this.container.appendChild(this.media);if(e&&this.media.paused){this.media.play()}}if(this._hasMedia){this._listener={};v.call(this,this._listener)}if(this._useCanvas){this.stage=document.createElement("canvas");this.stage.context=this.stage.getContext("2d")}else{this.stage=document.createElement("div");this.stage.style.cssText="overflow:hidden;white-space:nowrap;transform:translateZ(0);"}this.stage.style.cssText+="position:relative;pointer-events:none;";this.resize();this.container.appendChild(this.stage);this._space={};f(this._space);this._fontSize={root:16,container:16};w(document.getElementsByTagName("html")[0],this._fontSize);w(this.container,this._fontSize);if(!this._hasMedia||!this.media.paused){p.call(this);s.call(this)}this._isInited=true;return this}}var x=["mode","time","text","render","html","style","canvasStyle"];function b(t){t.prototype.emit=function(t){if(!t||Object.prototype.toString.call(t)!=="[object Object]"){return this}var i={};for(var e=0;e<x.length;e++){if(t[x[e]]!==undefined){i[x[e]]=t[x[e]]}}i.text=(i.text||"").toString();i.mode=_(i.mode);i._utc=Date.now()/1e3;if(this._hasMedia){var s=0;if(i.time===undefined){i.time=this.media.currentTime;s=this.position}else{s=n(this.comments,"time",i.time);if(s<this.position){this.position+=1}}this.comments.splice(s,0,i)}else{this.comments.push(i)}return this}}function M(t){t.prototype.clear=function(){if(this._useCanvas){this.stage.context.clearRect(0,0,this.width,this.height);for(var t=0;t<this.runningList.length;t++){this.runningList[t].canvas=null}}else{var i=this.stage.lastChild;while(i){this.stage.removeChild(i);i=this.stage.lastChild}}this.runningList=[];return this}}function L(t){t.prototype.destroy=function(){if(!this._isInited){return this}e.call(this);this.clear();if(this._hasMedia){g.call(this,this._listener)}if(this._hasVideo&&!this._hasInitContainer){var t=!this.media.paused;this.media.style.position=this.container.style.position;this.container.parentNode.insertBefore(this.media,this.container);this.container.parentNode.removeChild(this.container);if(t&&this.media.paused){this.media.play()}}for(var i in this){if(Object.prototype.hasOwnProperty.call(this,i)){this[i]=null}}return this}}function C(t){t.prototype.show=function(){if(this.visible){return this}this.visible=true;if(this._hasMedia&&this.media.paused){return this}p.call(this);s.call(this);return this}}function T(t){t.prototype.hide=function(){if(!this.visible){return this}e.call(this);this.clear();this.visible=false;return this}}function k(t){t.prototype.resize=function(){if(this._hasInitContainer){this.width=this.container.offsetWidth;this.height=this.container.offsetHeight}if(this._hasVideo&&(!this._hasInitContainer||!this.width||!this.height)){this.width=this.media.clientWidth;this.height=this.media.clientHeight}if(this._useCanvas){this.stage.width=this.width;this.stage.height=this.height}else{this.stage.style.width=this.width+"px";this.stage.style.height=this.height+"px"}this.duration=this.width/this._speed;return this}}function E(t){Object.defineProperty(t.prototype,"speed",{get:function(){return this._speed},set:function(t){if(typeof t!=="number"||isNaN(t)||!isFinite(t)||t<=0){return this._speed}this._speed=t;if(this.width){this.duration=this.width/t}return t}})}function I(t){this._isInited=false;t&&this.init(t)}y(I);b(I);M(I);L(I);C(I);T(I);k(I);E(I);return I});