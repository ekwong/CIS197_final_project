import React, { Component } from 'react';
import '../App.css';

class App extends Component {
  render() {
    const { songs = [] } = this.props;
    return (
      <div> {
        songs.map((song, key) => {
          return <div className="song" key={key}>{song.title}</div>;
        })
      }
      </div>
    );
  }
}

export default App;
