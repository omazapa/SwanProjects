import { ReactWidget } from "@jupyterlab/apputils";
import * as React from "react";
import { JSONObject } from '@lumino/coreutils';
import {Card,HelpTooltip} from './Components'
export interface IStackOptions {
  visible: boolean;
}
import {swanProjectIcon,sftIcon,cmsIcon,condaIcon} from './icons'

import Select from 'react-select'

// const LCGStack = (options:IStackOptions): JSX.Element => {
//   let stack_options=[{name:"97a",value:"LCG_97apython3"},{name:"97a Python 2",value:"LCG_97a"}];
//   //let platform_options=[{name:"Centos 7 (gcc8)",value:"x86_64-centos7-gcc8-opt"}];
//   return (
//     <div style={{display: options.visible ? '' : 'none' }}>
//     <div>
//     <label htmlFor="swan_project_type_list">Stack</label> 
//               <select name="swan_project_type_list" >{stack_options.map(key => {     
//                 return <option id={key.value}  value={key.value}>{key.name}</option>
//               })}</select></div>

//     </div>
//   );
// };


/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class ProjectWidget extends ReactWidget {
  /**
   * Constructs a new CounterWidget.
   */
  project_title: string;
  project_source: string; //LCG/CMSSW or Conda in the future 
  project_stack: string;
  project_platform: string;
  project_user_script: string;
  stacks_options: JSONObject;
  
  constructor(project_title:string,project_source:string,project_stack:string,project_platform:string,project_user_script:string,stacks_options:JSONObject) {
    super();
    this.addClass('jp-ReactWidget');
    this.project_title = project_title;
    this.project_source = project_source;
    this.project_stack = project_stack;
    this.project_platform = project_platform;
    this.project_user_script = project_user_script;
    this.stacks_options = stacks_options;
  }
  checkStack(stack: string): JSONObject {
    let stacksStatus = { 'LCG': false, 'CMS': false, 'Atlas': false, 'Alice': false, 'LCHb': false } as JSONObject;
    if (Object.keys(stacksStatus).includes(stack)) {
      stacksStatus[stack] = true;
      this.update();
    } else {
      //how to handle error?
    }
    return stacksStatus
  }
  changeFramework(option: string): void {
    console.log("OPTION", option)
  }
  handleSubmit(event: any) {
    alert('A name was submitted: ' + event);
    event.preventDefault();
  }
  handleChange(event: any) {
    //this.setState({value: event.target.value});
  }
  createProject(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    console.log("Creating project")
  }
  render(): JSX.Element {
    var options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'chocolate1', label: 'Chocolate' },
      { value: 'chocolate2', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' }
    ];
    return <span className='jp-Dialog-body' style={{ minHeight: '300px',minWidth: '420px'}}>
       <table style={{height: '100%', width: '98%' }}>
       <tbody>
       <tr >
          <td>                    
          <swanProjectIcon.react tag="span" width="50px" right="7px" top="5px"  />
        </td>
        <td colSpan={3}>
        <div style={{ width: '100%', padding: "5px 5px 5px 0px", }}>
          <input type="text" placeholder="Project Name" style={{ width: '100%', padding: "5px 0px 5px 0px", }} onChange={this.handleChange} />
          </div>
      </td>

      </tr>
      <tr>
        <td colSpan={1}>        
        <div style={{float:"left"}}>{Card("LCG",sftIcon,null)}</div>
        </td>
        <td colSpan={1}>
          <div style={{float:"left"}}>{Card("CMSSW",cmsIcon,null)}</div>        
          </td> 
        <td colSpan={1}>
        <div style={{float:"left"}}>{Card("Conda",condaIcon,null)}</div>          
          </td> 
        <td colSpan={1}>
          
        </td>

      </tr>
          <tr>
                <td colSpan={2}>
                <div style={{display:"flex"}}>
                <div> Release  </div>
                <div> {HelpTooltip("release","Software stack: LCG/CMSSW release <br/> \
                                              that will be used to configure your environment.<br/> \
                                              From your project, you will have available <br/>\
                                              all the software packages included in the LCG/CMSSW release that you selected.")} </div>  
                </div>
                </td>
                <td colSpan={2}>Platform</td>
            </tr>
            <tr style={{width:"100%"}}>
                <td colSpan={2} style={{width:"50%"}}>
                {/* https://react-select.com/advanced#portaling */}
                  {<Select isSearchable={false} options={options} menuPortalTarget={document.body} menuPosition={'absolute'} styles={{ menuPortal: base => ({ ...base, zIndex: 999999 }) }}  menuShouldScrollIntoView={false} />}
                </td>
                <td colSpan={2} style={{width:"50%"}}>
                  {<Select isSearchable={false} options={options} menuPortalTarget={document.body}  menuPosition={'absolute'} styles={{ menuPortal: base => ({ ...base, zIndex: 999999 }) }}  menuShouldScrollIntoView={false}/>}
                </td>
            </tr>
            <tr>
            <td colSpan={4}>
              <div style={{display:"flex"}}>
              <div> Bash Script  </div>
              <div> {HelpTooltip("bash_script","User Script")} </div>  
              </div> <br/>
              <div style={{ width: '100%' }}>
              <input type="text" placeholder="Bash User Script" style={{ width: '100%', padding: "5px 0px 5px 0px", }} onChange={this.handleChange} />
              </div>
              
            </td>              

            </tr>
          </tbody>
        </table>
    </span>;
  }
}
