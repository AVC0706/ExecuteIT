import React from "react"
import GlobalContext from '../../context/GlobalContext';
import EditorTabs from './editorTabs.component'

export default class EditorGoupComponent extends React.Component {

    static contextType = GlobalContext

    constructor(props){
        super(props)
        this.state = {
          loading: false    
        }

        //----------USE GLOBAL STATES---------

        // this.store = new EditorsStore(props.rtModel);
        // this.state = this.context.getStateFromContext()

        // console.log(props.rtModel)
  }

  componentWillMount() {

    // this.store.addChangeListener(this.onChange);
    this.loadData()
    
  }

  loadData = async ()=>{
    await this.context.setInitStates(this.props.rtModel);
    await this.setState({loading: true })
  }

 

  componentWillUnmount() {
    // this.store.removeChangeListener(this.onChange);
    this.context.dispose();
  }

//   onChange = () => {
//     this.setState(this.context.getStateFromContext());
//   };

    render(){
      const loading = this.state.loading
         
        return(
          loading?
    
          <EditorTabs
                    editors={this.context.editors}
                    activeEditor={this.context.activeEditor}
                />:<div></div>
        
                
                )
    }
}