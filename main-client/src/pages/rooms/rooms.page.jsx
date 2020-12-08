import React from 'react'
import axios from 'axios'
import cookie from 'react-cookies'
import RoomCardComponent from '../../components/roomCard/roomCard.component'
import { Row, Col, Button, Space, Input, Modal, notification, Typography } from 'antd';
import { PlusOutlined, CodeOutlined } from '@ant-design/icons';
import qs from 'querystring'
import { withRouter } from 'react-router-dom'
import validator from 'validator';

class RoomPage extends React.Component {
    constructor(props) {
        super(props)
        axios.defaults.headers.common['x-api-key'] = cookie.load('jwt')
        axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
        this.state = {
            rooms: [],
            visible: false,
            roomName: '',
            joinRoomData: ''
        }
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_MAIN_SERVER}/rooms`)
            .then((res) => {
                this.setState({ rooms: res.data.rooms })
            })
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = async () => {
        this.setState({
            confirmLoading: true,
        });

        const requestBody = {
            roomName: this.state.roomName
        }

        axios.post(`${process.env.REACT_APP_MAIN_SERVER}/rooms`, qs.stringify(requestBody))
            .then(res => {
                console.log(res, 'PRATIK')
                this.setState(
                    { confirmLoading: false, visible: false, roomName: "" }
                )
                return res
            })
            .then((res) => {
                notification.success({
                    message: 'Room Created',
                    description:
                        `Room ${res.data.roomName} was created successfully, Now invite paritcipants using invite link`,
                });
                this.setState({joinRoomData: ""})
                return res.data
            })
            .then((data) => {
                console.log(':LLL',data)
                this.props.history.push({
                    pathname: '/workspace',
                    state:
                    {
                        roomName: data.roomName,
                        inviteCode: data.inviteCode,
                        roomId: data.roomId,
                        roomURL: data.roomURL
                    }
                })
            })
            .catch((e, res) => {
                this.setState(
                    { confirmLoading: false, visible: false, roomName: "" }
                )
                if (e.response.data.status === 'room_name_duplicate') {
                    notification.warning({
                        message: 'Duplicate Room Name',
                        description:
                            `Please enter new room name`,
                    });
                    this.setState({ visible: true })
                }
                else {
                    notification.error({
                        message: 'Error',
                        description:
                            `Some Error Occurred`,
                    });

                }
            })


    };

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };

    changeRoomName = (e) => {
        this.setState({ roomName: e.target.value })
    }

    changeJoinRoomName = (e) => {
        this.setState({ joinRoomData: e.target.value })
    }

    joinRoom = () => {
        if (validator.isUUID(this.state.joinRoomData)) {
            axios.post(`${process.env.REACT_APP_MAIN_SERVER}/rooms/join?inviteCode=${this.state.joinRoomData}`)
                .then((res) => {
                    notification.success({
                        message: 'Room Joined',
                        description:
                            `Room ${res.data.roomName} was joined successfully.`,
                    });
                    return res.data
                })
                .then((data) => {
                    console.log(':LLL',data)

                    this.props.history.push({
                        pathname: '/workspace',
                        state:
                        {
                            roomName: data.roomName,
                            inviteCode: data.inviteCode,
                            roomId: data.roomId,
                            roomURL: data.roomURL
                        }
                    })
                })
                .catch(e => {
                    if (e.response.data.status === 'already_joined') {
                        notification.warning({
                            message: 'Room Already Joined',
                            description:
                                `You have already joined the room, find your room in my rooms section and click on enter button`,
                        });
                    } else {
                        notification.error({
                            message: 'Error',
                            description:
                                `Some Error Occurred`,
                        });

                    }
                })


        } else {
            notification.error({
                message: 'Invalid Invite Code',
                description:
                    `Please recheck invite code`,
            });
        }
    }

    render() {
        const rooms = this.state.rooms
        return (
            <div style={{padding: '3rem'}}>

                <Typography.Title style={{marginLeft: '1rem'}}>Rooms</Typography.Title>

                <br/><br/>

                <Space size={50}>
                    <Button onClick={() => { this.setState({ visible: true }) }} type='primary' size='large' icon={<PlusOutlined />}>Create Room</Button>
                    <Space size='middle'>
                        <Input
                            onChange={this.changeJoinRoomName}
                            value={this.state.joinRoomData}
                            style={{ width: '30vw' }}
                            size="large"
                            placeholder="Enter Invite Code"
                        />
                        <Button disabled={this.state.joinRoomData.length === 0} onClick={this.joinRoom} type='primary' size='large' icon={<CodeOutlined />}>Join Room</Button>
                    </Space>
                </Space>

                <br /><br />
                <br /><br />
                <Row  >
                    {
                        rooms.map((x) => (
                            <Col key={x.inviteCode} span={6} ><RoomCardComponent
                                roomName={x.roomName}
                                inviteCode={x.inviteCode}
                                isAdmin={x.isHost}
                                roomId={x.roomId}
                                roomURL={x.roomURL}
                            />
                            </Col>
                        ))


                    }
                </Row>
                <Modal
                    title="Create Room"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                    okButtonProps={{ disabled: this.state.roomName.length === 0 }}
                >
                    <Input value={this.state.roomName} onChange={this.changeRoomName} placeholder="Room Name" />
                </Modal>
            </div>)
    }
}

export default withRouter(RoomPage)