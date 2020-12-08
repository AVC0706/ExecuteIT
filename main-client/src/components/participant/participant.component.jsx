import React from 'react';
import { Avatar, Space, Typography, Popover } from 'antd'
import VoiceChatMainComponent from '../voiceChannel/voiceChatMain.component'

const { Text } = Typography

const menu = (props) => {
  const data = JSON.parse(props)

  return (
    <Text>{data.email}</Text>
  )

}

const title = (props) => {
  const data = JSON.parse(props)

  return (
    <Space size='large'>
      <Avatar style={{ borderWidth: 4, borderColor: props.color, borderStyle: 'solid' }} size={45} src={data.image} />
      <Typography.Text>{data.displayName}</Typography.Text>
    </Space>
  )

}

const Participant = function (props) {
  console.log(props)
  return (
    // <div className="participant">
    //   <div
    //     className="participant-username"
    //     style={{borderLeftColor: props.color}}
    //   >{JSON.parse(props.displayName).displayName}</div>
    // </div>
    <div style={{ marginTop: '1rem' }}>
      <Popover content={() => (menu(props.displayName))} placement='left' title={() => (title(props.displayName))}>
        <Space>
          <Avatar style={{ borderWidth: 4, borderColor: props.color, borderStyle: 'solid' }} size={45} src={JSON.parse(props.displayName).image} />
          <Typography.Text>{JSON.parse(props.displayName).displayName}</Typography.Text>
          {props.isSelf && <VoiceChatMainComponent />}
        </Space>
      </Popover>
    </div>

  );
};

export default Participant;
