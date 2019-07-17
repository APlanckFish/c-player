import React from 'react';
import './App.css';
import Player from './components/player';
import poster from './assets/test.jpg'
// import videos from './assets/video.mp4'

const videos = require('./assets/video.mp4')

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Player src={videos} poster={poster}></Player>
      </header>
    </div>
  );
}

export default App;
