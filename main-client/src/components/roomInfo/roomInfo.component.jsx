import React  from 'react'
import { Typography } from 'antd'

const { Text } = Typography

const RoomInfo = (props) => {


    return (
        <div style={{ padding: '1rem' }}>
            <Typography.Title level={3}>Room Info</Typography.Title>
            <div>
                <Text strong>Room Name: </Text><Typography.Text>{props.roomName}</Typography.Text>

            </div>
            <br/>
            <div>
                <Text strong>Invite Code: </Text>
                <br/>
                <Typography.Text copyable>{`https://executeit.ml/join?inviteCode=${props.inviteCode}`}</Typography.Text>
            </div>

        </div>
    )
}

export default RoomInfo
