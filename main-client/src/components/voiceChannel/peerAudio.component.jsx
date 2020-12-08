import React from 'react'

export default class PeerAudioComponent extends React.Component {
    constructor(props) {
        super(props);
        this.audioRef = React.createRef()
        console.log("Incoming audio!")
    }

    componentDidMount() {
        // if(this.props.stream.audio)
        this.audioRef.current.srcObject = this.props.stream.audio;
    }

    componentDidUpdate() {
        this.audioRef.current.srcObject = this.props.stream.audio;
    }

    render() {
        return <div>
            <audio playsInline ref={this.audioRef} autoPlay/>
        </div>
    }
}