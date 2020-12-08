import React from 'react'
import ReactHtmlParser from 'react-html-parser';
import {withRouter} from "react-router-dom";
import cookie from 'react-cookies'
import {Card, Col, Row, Space, Typography} from 'antd';
import GoogleButton from 'react-google-button'
import './signIn.styles.css'

const queryString = require('query-string');

const {Title} = Typography;

// import v from "../../assets/video.mp4"
class SignIn extends React.Component {
    url = process.env.REACT_APP_MAIN_SERVER + "/auth/google"

    constructor(props) {
        super(props)
        this.state = {
            windowObjectReference: null,
            previousUrl: null,
        }

    }

    openSignInWindow = (url, name) => {
        // remove any existing event listeners
        window.removeEventListener('message', this.receiveMessage);

        // window features
        const strWindowFeatures =
            'toolbar=no, menubar=no, width=600, height=700, top=100, left=600';

        if (this.state.windowObjectReference === null || this.state.windowObjectReference.closed) {
            /* if the pointer to the window object in memory does not exist
             or if such pointer exists but the window was closed */
            this.setState({windowObjectReference: window.open(url, name, strWindowFeatures)});
        } else if (this.state.previousUrl !== url) {
            /* if the resource to load is different,
             then we load it in the already opened secondary window and then
             we bring such window back on top/in front of its parent window. */
            this.setState({windowObjectReference: window.open(url, name, strWindowFeatures)});
            this.state.windowObjectReference.focus();
        } else {
            /* else the window reference must exist and the window
             is not closed; therefore, we can bring it back on top of any other
             window with the focus() method. There would be no need to re-create
             the window or to reload the referenced resource. */
            this.state.windowObjectReference.focus();
        }

        // add the listener for receiving a message from the popup
        window.addEventListener('message', event => this.receiveMessage(event), false);
        // assign the previous URL
        this.setState({previousUrl: url});
    };


    receiveMessage = async event => {
        const {data} = event;

        if (data.source !== 'react-devtools-bridge') {
            const token = await queryString.parse(data).token
            console.log(data)
            await cookie.save('jwt', token, {path: '/'})
            window.location.replace('/rooms')
        }
    };

    render() {
        return (

            <div id="homepage">

                <Card id="login-card" bordered={false}>
                    <Row justify="center" align="middle">
                        <Col style={{marginLeft: '3rem', marginTop: '1rem'}}  span={24}>
                            <Title>{`< Execute It />`}</Title>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                            <div style={{transform:"translate(2rem,-2rem)"}}>{ReactHtmlParser(`
                                                        <lottie-player src="https://assets1.lottiefiles.com/packages/lf20_sFBr0l/snscit.json"  
                                                        background="transparent"  
                                                        speed="1"  
                                                        style="width: 600px; height: 600px;"  
                                                        loop autoplay>
                                                        </lottie-player>

`)}</div>

                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8} xl={8} style={{position: 'relative'}}>
                            <div style={{
                                textAlign: 'center',
                                position: 'absolute',
                                top: '31%',
                                transform: 'translateY(-50%)',
                                marginRight: '1rem'
                            }}>
                                <h2><em style={{fontSize: '177%'}}>Realtime Code Collaboration Platform</em></h2>
                                <br/><br/><br/>
                                <Space align="end"> <GoogleButton onClick={() => {
                                    this.openSignInWindow(this.url, 'Sign In')
                                }}/>
                                </Space>
                            </div>


                        </Col>
                    </Row>
                </Card>
            </div>
        )
    }
}

export default withRouter(SignIn)