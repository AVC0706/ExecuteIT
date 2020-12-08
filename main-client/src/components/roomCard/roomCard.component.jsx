import React from 'react'
import { Card, Typography, Button } from 'antd'
import { RightOutlined } from '@ant-design/icons';
import {withRouter} from 'react-router-dom'
const { Paragraph } = Typography



const RoomCardComponent = ({ roomName, inviteCode, isAdmin,roomId,history,roomURL }) => {
  const enterRoom = ()=>{
    history.push({
      pathname: '/workspace',
      state:
      {
          roomName: roomName,
          inviteCode: inviteCode,
          roomId: roomId,
          roomURL: roomURL,
         
      }
  })
  }

    const inviteLink = `https://executeit.ml/join?inviteCode=${inviteCode}`

  return (
    <Card
      size="small"
      title={roomName}
      style={{ width: 300 }}
      // actions={[
      //   <SettingOutlined key="setting" />,
      //   <EditOutlined key="edit" />,
      //   <EllipsisOutlined key="ellipsis" />,
      // ]}
    >
      <div>
        <Paragraph copyable={{ text: inviteCode }}>{`Invite Code: ${inviteCode} `}.</Paragraph>
        <Paragraph copyable={{ text: inviteLink }}> {"Invite Link: " + inviteLink }</Paragraph>

        
        <Paragraph>Role: {isAdmin ? 'Admin' : 'Participant'}</Paragraph>
        <Button onClick={enterRoom} icon={<RightOutlined />} type='primary' size='middle'>Enter</Button>

      </div>

    </Card>
  )
}

export default withRouter(RoomCardComponent)