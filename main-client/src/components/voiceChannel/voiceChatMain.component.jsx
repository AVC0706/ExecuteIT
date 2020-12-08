import React from 'react';
import VoiceChannelComponent from "./voiceChannel.component";


const socket = require('socket.io-client')


class VoiceChatMainComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null
        }
        this.socket = null
        this.username = `user${Math.random() * 1000}`;
        this.room = 'room11'
    }

    componentDidMount() {
        this.socket = socket(`${process.env.REACT_APP_MEDIASOUP_URL}`, {
            query: {
                roomId: this.room,
                peerName: this.username
            },
        });

        this.socket.on('connect', () => {
            console.log(this.socket.id)
            this.socket.emit('authentication', {
                token: 'highSekurityToken',
                roomId: this.room
            });

            // Handle unauthorized
            this.socket.on('unauthorized', err => {
                console.log(err)
                this.socket.close()
                if (err.message.includes('Unauthorized'))
                    alert("Unauthenticated")
                else
                    alert("Not allowed in the room!")
            });

            // Handle successful auth
            this.socket.on('authenticated', () => {
                console.log("Logged In!");
                this.setState({socket: this.socket})
            });
        });
    }

    componentWillUnmount() {
        this.socket.disconnect()
    }

    render() {
        return (<div >
            {this.state.socket && <VoiceChannelComponent socket={this.state.socket} username={this.username}/>}
        </div>)
    }
}

export default VoiceChatMainComponent;