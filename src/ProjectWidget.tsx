import { ReactWidget } from "@jupyterlab/apputils";
import * as React from "react";
import { JSONObject } from '@lumino/coreutils';
import { swanProjectIcon } from './icons'
import {Card,HelpTooltip} from './Components'
export interface IStackOptions {
  visible: boolean;
}

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
  cwd: string;
  framework_options: Array<any>;
  currentStack: string;
  useStack: JSONObject;
  
  constructor(cwd: string) {
    super();
    this.addClass('jp-ReactWidget');
    this.framework_options = ['LCG', 'CMS', 'Atlas', 'Alice', 'LCHb']
    this.currentStack = this.framework_options[0];
    this.useStack = this.checkStack(this.currentStack);
    
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
//    return <div className='jp-Input-Dialog' style={{ height: '100%', width: '100%', alignItems: 'left' }}>
    return <span className='jp-Dialog-body' >
       <table style={{ height: '100%', width: '95%' }}>
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
        <div style={{float:"left"}}>{Card("LCG",null)}</div>
        </td>
        <td colSpan={1}>
          <div style={{float:"left"}}>{Card("CMSSW",null)}</div>        
          </td> 
        <td colSpan={1}>
        <div style={{float:"left"}}>{Card("Conda",null)}</div>          
          </td> 
        <td colSpan={1}>
          
        </td>

      </tr>
          <tr>
                <td colSpan={2}>
                <div style={{display:"flex"}}>
                <div> Release  </div>
                <div> {HelpTooltip("bash_script","User Script")} </div>  
                </div>
                </td>
                <td colSpan={2}>Platform</td>
            </tr>
            <tr style={{width:"100%"}}>
                <td colSpan={2} style={{width:"50%"}}>
                {/* https://react-select.com/advanced#portaling */}
                  {<Select options={options} menuPortalTarget={document.body} menuPosition={'absolute'} styles={{ menuPortal: base => ({ ...base, zIndex: 999999 }) }}  menuShouldScrollIntoView={false} />}
                </td>
                <td colSpan={2} style={{width:"50%"}}>
                  {<Select options={options} menuPortalTarget={document.body}  menuPosition={'fixed'} styles={{ menuPortal: base => ({ ...base, zIndex: 999999 }) }}  menuShouldScrollIntoView={false}/>}
                </td>
            </tr>
            <tr>
            <td colSpan={4}>
              <div style={{display:"flex"}}>
              <div> Bash Script  </div>
              <div> {HelpTooltip("bash_script","User Script")} </div>  
              </div> <br/>
              <div style={{ width: '100%' }}>
              <input type="text" placeholder="Project Name" style={{ width: '100%', padding: "5px 0px 5px 0px", }} onChange={this.handleChange} />
              </div>
              
            </td>              

            </tr>
          </tbody>
        </table>
    </span>;
  }
}
