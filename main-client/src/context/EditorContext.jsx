import React, { Component } from 'react'
import {findChildParentId, isNodeFolder, generateUUID} from '../utils/utils';
import EditorData from "../utils/editorData"

const EditorContext = React.createContext()

class EditorProvider extends Component {
    constructor(props){
        super(props);
        // Context state
        this.state = {
            editors: [],
            activeEditor: null,
            modelService: null,
            collectionId: null,
            username: null,
            rtModel: null
        }
    }

    setInitStates = (rtModel) => {
        this.setState({modelService: rtModel.session().domain().models() , collectionId: "files" , username: rtModel.session().user().username , rtModel: rtModel })
    }

    dispose=()=>{

        this.setState ({
            editors: null,
            activeEditor: null,
            modelService: null,
            collectionId: null,
            username: null,
            rtModel: null
        })
    }

    getStateFromContext = () => {
        return { editors: this.state.editors , activeEditor: this.state.activeEditor }
    }

    // Method to update state
   createEditor=(id, model, historical)=> {
       console.log("create editor")
    const editor = new EditorData(id, this.getFileName(id) , model, historical);
    let editors = this.state.editors;
    editors.push(editor);
    console.log(editors[0].title)
    this.setState({activeEditor: editor, editors})
  }


  getFileName = (fileId)=> {
      console.log(this.state.rtModel)
    return this.state.rtModel.elementAt(['tree', 'nodes', fileId]).get('name').value();
  }

  createModel = (id) =>{
    return this.state.modelService.create({
      collection: this.state.collectionId,
      id,
      data: {
        content: ''
      }
    });
  }


  openModel = (modelId) => {
    return this.state.modelService.open(modelId);
  }


  //CREATE_FILE
  CreateFile = () => {
    const uuid = generateUUID()

    const nodes = this.state.rtModel.elementAt(['tree', 'nodes']);
    nodes.set(uuid, {name: "newF.js"});
    const parentFolder = this.state.rtModel.elementAt(['tree', 'nodes', "root", 'children']);
    parentFolder.push(uuid);

    return new Promise((resolve, reject)=>{
      this.createModel(uuid).then(() => {
        return this.openModel(uuid);
      }).then(model => {
        this.createEditor(uuid, model, false);
        resolve()
      });
    })
  }

    render() {
        const { children } = this.props
        const { editors, activeEditor, modelService, collectionId, username, rtModel } = this.state
        const { createEditor, dispose, getStateFromContext, setInitStates, CreateFile } = this

        return (<EditorContext.Provider value={
            {
               editors,
               activeEditor,
               createEditor,
               dispose,
               getStateFromContext,
               setInitStates,
               CreateFile
            }
        } > {children} </EditorContext.Provider>)
        }
    }

    export default EditorContext

    export { EditorProvider}