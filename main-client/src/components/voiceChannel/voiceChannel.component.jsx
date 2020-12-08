import React from "react";
import PeerAudioComponent from "./peerAudio.component";
import {Button} from "antd"
import {AudioOutlined, AudioMutedOutlined} from "@ant-design/icons"


const mediasoupClient = require('mediasoup-client');

export default class VoiceChannelComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            streams: [],
            selfAudioOn: false,
            audioProducer: null
        }
    }

    componentDidMount() {
        this.room = new mediasoupClient.Room()

        this.room.join(this.props.username)
            .then((peers) => {
                console.log('PEERS:', peers);

                // Create the Transport for sending our media.
                this.sendTransport = this.room.createTransport('send');
                // Create the Transport for receiving media from remote Peers.
                this.recvTransport = this.room.createTransport('recv');

                peers.forEach(peer => this.handlePeer(peer));
                if (this.state.selfAudioOn)
                    this.handleAudioToggle()
            })

        // Event fired by local room when a new remote Peer joins the Room
        this.room.on('newpeer', (peer) => {
            console.log('A new Peer joined the Room:', peer.name);

            // Handle the Peer.
            this.handlePeer(peer);
        });

        // Event fired by local room
        this.room.on('request', (request, callback, errback) => {
            console.log('REQUEST:', request);
            this.props.socket.emit('mediasoup-request', request, (err, response) => {
                if (!err) {
                    // Success response, so pass the mediasoup response to the local Room.
                    callback(response);
                } else {
                    errback(err);
                }
            });
        });

        // Be ready to send mediaSoup client notifications to our remote mediaSoup Peer
        this.room.on('notify', (notification) => {
            console.log('New notification from local room:', notification);
            this.props.socket.emit('mediasoup-notification', notification);

        });

        this.props.socket.on('mediasoup-notification', (notification) => {
            console.debug('New notification came from server:', notification);
            this.room.receiveNotification(notification);
        });
    }

    handlePeer = (peer) => {
        console.log('newPeer')

        // Handle all the Consumers in the Peer.
        peer.consumers.forEach(consumer => this.handleConsumer(consumer, peer.name));

        // Event fired when the remote Room or Peer is closed.
        peer.on('close', () => {
            console.log('Remote Peer closed');
            let streams = this.state.streams;
            delete streams[peer.name]
            this.setState({streams})
        });

        // Event fired when the remote Peer sends a new media to mediasoup server.
        peer.on('newconsumer', (consumer) => {
            console.log('Got a new remote Consumer');

            // Handle the Consumer.
            this.handleConsumer(consumer, peer.name);
        });
    }

    handleConsumer = (consumer, peerName) => {
        // Receive the media over our receiving Transport.
        consumer.receive(this.recvTransport)
            .then((track) => {
                console.log('Receiving a new remote MediaStreamTrack:', consumer.kind);

                // Attach the track to a MediaStream and play it.
                const stream = new MediaStream();
                stream.addTrack(track);

                if (consumer.kind === 'video') {
                //    Do nothing, video not supported for now
                }
                if (consumer.kind === 'audio') {
                    let streams = this.state.streams
                    if (!streams[peerName])
                        streams[peerName] = {}
                    streams[peerName].audio = stream
                    this.setState({streams})
                }
            });

        // Event fired when the Consumer is closed.
        consumer.on('close', () => {
            console.log('Consumer closed');
        });
    }

    handleAudioToggle = () => {
        console.log('toggle audio')
        if (!this.state.audioProducer) {
            // Get our mic and camera
            navigator.mediaDevices.getUserMedia({
                audio: true,
            })
                .then((stream) => {
                    console.log('got self audio stream', stream)
                    this.audioStream = stream
                    this.audioTrack = stream.getAudioTracks()[0];

                    // Create Producers for audio and video.
                    this.setState({audioProducer: this.room.createProducer(this.audioTrack)});
                    this.setState({selfAudioOn: true});

                    // Send our audio.
                    this.state.audioProducer.send(this.sendTransport);
                });
        } else {
            this.audioStream.getAudioTracks().forEach(track => {
                this.state.audioProducer.close()
                track.stop()
            })
            this.setState({audioProducer: null});
            this.setState({selfAudioOn: false});
        }
    }

    componentWillUnmount() {
        if (this.state.audioProducer)
            this.handleAudioToggle()
    }

    render() {
        return <div>
            {/* Actual Audios component */}
            {Object.keys(this.state.streams).map((peerName) => {
                return <PeerAudioComponent key={peerName} stream={this.state.streams[peerName]}/>
            })}
            <Button type="primary" shape="circle" onClick={_=>this.handleAudioToggle()} icon={
            this.state.selfAudioOn ? <AudioOutlined /> : <AudioMutedOutlined />
            } />
            {/* Mic: {(this.state.selfAudioOn && "On") || "Off"}
            <div style={{cursor: "pointer"}} onClick={_=>this.handleAudioToggle()}>Toggle mic</div> */}
        </div>
    }

}