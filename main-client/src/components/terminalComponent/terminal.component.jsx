import React from 'react'
import {XTerm} from "xterm-for-react"
import { AttachAddon } from 'xterm-addon-attach';
import cookie from 'react-cookies'
import GlobalContext from '../../context/GlobalContext';


export default class TerminalComponent extends React.Component {

    static contextType = GlobalContext

    constructor(props) {
        super(props);
        this.state = {
            ws : `ws://${this.props.roomUrl}`,
            http : `http://${this.props.roomUrl}`
        }

        this.xtermRef = React.createRef();
    }

    componentDidMount() {        
        const terminal = this.xtermRef.current.terminal;
        const cols = terminal._core.element.offsetWidth/terminal._core._renderService.dimensions.actualCellWidth;
        const rows = this.xtermRef.current.terminal.rows;
        console.log(cols, rows)

        fetch(this.state.http + '/terminals?cols=' + cols + '&rows=' + rows+"&token="+cookie.load('jwt'), {method: 'POST'}).then((res) => {
            res.text().then((pid) => {
                console.log(pid)
                const ws = new WebSocket(`${this.state.ws}/terminals/${pid}?token=${cookie.load('jwt')}`);
                ws.onopen = ()=>{
                    const attachAddon = new AttachAddon(ws);
                    terminal.loadAddon(attachAddon);
                    this.context.setWS(ws,this.state.http)
                }

                ws.onclose = ()=>{
                    terminal.write("\n\r\x1B[1;3;31mDisconnected from console!\x1B[0m")
                }
            })
        })
    }

    render() {
        return (
            <XTerm ref={this.xtermRef} className={this.props.className} />
        )
    }
}
