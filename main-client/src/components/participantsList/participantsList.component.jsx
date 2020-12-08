import React from 'react';
import colorAssigner from '../../utils/color-util';
import Participant from '../participant/participant.component'
import {Typography} from 'antd'
import UserContext from '../../context/UserContext'


export default class ParticipantsList extends React.Component {

  static contextType = UserContext


  constructor(props) {
    super(props);

    this.state = {
      participants: []
    };
  }

  componentDidMount() {
    this.subscription = this.props.activity.participantsAsObservable().subscribe(participants => {
      console.log('hello',participants)
      let orderedParticipants = []
      participants.forEach(participant=>{
        if(JSON.parse(participant.user.displayName).email === this.context.user.email){
          orderedParticipants.push(participant)
        }
      })
      participants.forEach(participant=>{
        if(JSON.parse(participant.user.displayName).email !== this.context.user.email){
          orderedParticipants.push(participant)
        }
      })
      this.setState({participants: orderedParticipants});
    });
  }

  componentWillUnmount() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  createParticipant(participant, isSelf) {
    console.log(participant.user)
    return (<Participant
      key={participant.sessionId}
      displayName={participant.user.displayName}
      isSelf={isSelf}
      color={colorAssigner.getColorAsHex(participant.sessionId)} />);
  }


  render() {
    const participants = this.state.participants.map((participant, i) => {
      return this.createParticipant(participant, i===0);
    });
    
    return (
      <div style={{padding: '1rem'}}>
        <Typography.Title level={3}>Participants</Typography.Title>

          <div className="participants-list">{participants}</div>
      </div>
    
    
    );
  }
}
