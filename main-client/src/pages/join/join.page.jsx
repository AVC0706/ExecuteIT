import React from 'react'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string';
import validator from 'validator';
import { Spin, Result, Button, notification } from 'antd'
import axios from 'axios'
import cookie from 'react-cookies'

class JoinPage extends React.Component {
    constructor(props) {
        super(props)
        axios.defaults.headers.common['x-api-key'] = cookie.load('jwt')
        axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
        this.state = {
            isValid: true
        }
    }

    componentDidMount() {
        this.checkInviteCode(queryString.parse(this.props.history.location.search).inviteCode);
    }

    checkInviteCode = async (inviteCode) => {

        if (validator.isUUID(inviteCode)) {
            //send put request and then redirect to workspace

            await axios.post(`${process.env.REACT_APP_MAIN_SERVER}/rooms/join?inviteCode=${inviteCode}`)
                .then(res => {
                    notification.success({
                        message: 'Room Joined',
                        description:
                            `Room ${res.data.roomName} was joined successfully.`,
                    }); 
                    return res.data
                })
                .then(data => {
                    this.props.history.push({
                        pathname: '/workspace',
                        state:
                        {
                            roomName: data.roomName,
                            inviteCode: data.inviteCode,
                            roomId: data.roomId
                        }
                    })
                })
                .catch((e) => {
                    if (e.response.data.status === 'already_joined') {
                        notification.warning({
                            message: 'Room Already Joined',
                            description:
                                `You have already joined the room, find your room in my rooms section and click on enter button`,
                        });
                        this.props.history.push('/rooms')
                    }
                    this.setState({ isValid: false })
                })

        } else {
            this.setState({ isValid: false })
        }

    }

    render() {
        return (
            this.state.isValid ?
                <div><Spin /></div>
                :
                <div>  <Result
                    status="404"
                    title="Invalid Invite Code"
                    extra={<Button type="primary" href="/rooms">Back to Rooms</Button>}
                /></div>
        )
    }
}

export default withRouter(JoinPage)