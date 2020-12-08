import React from "react"
import GlobalContext from '../../context/GlobalContext';
import * as ace from 'ace-builds';
import AceBinder from './AceBinder.js';

import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/ext-modelist";

import './editor.css'

export default class EditorComponent extends React.Component {

    static contextType = GlobalContext

    constructor(props) {
        super(props);
    console.log(props)
    
  
        this.state = {
          cursor: {
            row: 0,
            column: 0
          },
          participants: []
        };
      }

      componentDidMount() {
        console.log(this.props.fileName)

        // if (!this.props.historical) {
        //   this._participantsSubscription = this.props.fileModel
        //     .collaboratorsAsObservable()
        //     .subscribe(participants => {
        //       this.setState({participants: participants});
        //     });
        // }

        // const modeList = ace.require("ace/ext/modelist");
        // const mode = modeList.getModeForPath(this.props.fileName);
        this.context.setTerm( this.props.fileModel , this.props.fileName )

        this.initEditor();

      }

      componentWillUnmount() {
        if (this._participantsSubscription !== undefined) {
          this._participantsSubscription.unsubscribe();
        }

      }

      handleCursorMove = (cursor) => {
        console.log(cursor , this.state.cursor)
        this.setState({cursor: cursor});
      };


      initEditor() {
        const contentModel = this.props.fileModel.root().get('content');
        console.log(contentModel)
    
        this._editor = ace.edit(this._container);
        this._editor.setTheme("ace/theme/vibrant_ink");

        const modeList = ace.require("ace/ext/modelist");
        const mode = modeList.getModeForPath(this.props.fileName);
        console.log(mode.mode)
        this._editor.getSession().setMode(mode.mode);

        this._editor.getSession().setValue(contentModel.value());
    
        this._editor.getSession().selection.on('changeCursor', () => {
          const cursorPosition = this._editor.getCursorPosition();
          this.handleCursorMove(cursorPosition);
        });
    
        this._editor.setReadOnly(this.props.historical);
    
        const aceBinder = new AceBinder(this._editor, contentModel, !this.props.historical, this._radarViewElement);
        aceBinder.bind();
      }


    render(){

    

    return (
      this.props.fileModel !== undefined ?
        <div className="editor-container" >
          <div className="editor" ref={(div) => {
            this._container = div;
          }} />
          <div className="radar-view" ref={(div) => {
            this._radarViewElement = div;
          }} />
          {/* <div><button onClick={this.runFunction}>RUN</button></div> */}
        </div> :
        <div>loading...</div>
    );
    }
}