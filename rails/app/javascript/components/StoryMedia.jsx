import React, { PureComponent } from "react";
import PropTypes from 'prop-types';

class StoryMedia extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      explicitVideoHeight: null
    }
  }

  static propTypes = {
    file: PropTypes.object,
    doBustCache: PropTypes.func
  };

  renderAudio() {
    const { file } = this.props;
    return (
      <audio id={`audio-player${file.blob.id}`} controls>
        <source src={file.url} type={file.blob.content_type} />
      </audio>
    );
  }

  renderImage() {
    const { file } = this.props;
    const { explicitVideoHeight } = this.state;
    return (
      <img
        id = {`img${file.blob.id}`}
        className="img-player"
        width="80%"
        key={file.url}
        ref="img"
        src={file.url}
        >
        </img>
    )
  }

  renderVideo() {
    const { file } = this.props;
    const { explicitVideoHeight } = this.state;
    return (
      <video
        id={`video-player${file.blob.id}`}
        className="video-player"
        height={explicitVideoHeight}
        playsInline
        controls
        disablePictureInPicture='true'       
        controlsList='nodownload'
        key={file.url}
        ref="video"
      >
        <source src={file.url} type={file.blob.content_type} />
      </video>
    );
  }

  render() {
    if (this.props.file.blob.content_type.indexOf("video") !== -1)
    {
      return this.renderVideo();
    }
    else if (this.props.file.blob.content_type.indexOf("audio") !== -1)
    {
      return this.renderAudio();
    }
    else{
      return this.renderImage();
    }
  }

  componentDidMount() {
    const { doBustCache } = this.props;
    const video = this.refs.video;

    if (!!video === true) {
      video.addEventListener('loadeddata', (event) => {
        const aspectRatio = video.videoWidth / video.videoHeight;
        const newExplicitVideoHeight = video.offsetWidth / aspectRatio;
        this.setState({ explicitVideoHeight: newExplicitVideoHeight });
        doBustCache();
      });
      video.addEventListener('play', (event) => {
        window.pauseAllVideos(event.target);
      }, true);
    }
  }
}

export default StoryMedia;
