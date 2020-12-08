import React, { Component } from 'react'
import {findChildParentId, isNodeFolder, generateUUID} from '../utils/utils';


const TreeContext = React.createContext()

class TreeProvider extends Component {
    constructor(props){
        super(props);
        // Context state
        this.state = {
            rtModel: null,
            folderMarkedForDeletion: null
        }
    }

    setTreeInitStates = (rtModel) => {
        this.setState( { rtModel: rtModel })
    }

    dispose=()=>{

        this.setState ({
           
            rtModel: null
        })
    }


    getTreeState() {
        return {
          selectedId: this.selectedNode,
          newNode: this.newNode,
          folderMarkedForDeletion: this.state.folderMarkedForDeletion
        };
      }

    addNewNode(type, nodeId) {
        const nodes = this.getNodes();
        nodeId = nodeId || "root";
        let parentFolderId = nodeId;
        if(!isNodeFolder(nodes, nodeId)) {
          parentFolderId = findChildParentId(nodes, nodeId);
        } 
        this.newNode = {type, folderId: parentFolderId};
      }


      markFolderForDelete(id){
        this.setState( { folderMarkedForDeletion: id })
      }

      deleteNode(id) { 
        const nodes = this.getNodes();
        const parent = findChildParentId(nodes, id);
    
        // delete the parent's reference to this node 
        const parentsChildren = nodes.get(parent).get('children');
        const childIndex = parentsChildren.findIndex(childId => childId.value() === id);
        parentsChildren.remove(childIndex);
    
        // delete the node 
        nodes.remove(id);
    
        if(this.selectedNode === id) {
          delete this.selectedNode;
        }
      }


    getNodes() {
        return this.rtModel.elementAt(['tree', 'nodes']);
      }

      getNode(id) {
        return this.rtModel.elementAt(['tree', 'nodes', id]);
      }


    render() {
        const { children } = this.props
        const {  rtModel } = this.state
        const { dispose, setTreeInitStates,getNodes, getNode, getTreeState, addNewNode, markFolderForDelete, deleteNode } = this

        return (<TreeContext.Provider value={
            {
               rtModel,
               dispose,
               setTreeInitStates,
               getNodes,
               getNode,
               getTreeState,
               addNewNode,
               deleteNode,
               markFolderForDelete
            }
        } > {children} </TreeContext.Provider>)
        }
    }

    export default TreeContext

    export { TreeProvider}