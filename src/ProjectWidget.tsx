import { ReactWidget } from "@jupyterlab/apputils";
import * as React from "react";
import { JSONObject } from '@lumino/coreutils';
import { swanProjectIcon } from './icons'
import {Card} from './Components'
export interface IStackOptions {
  visible: boolean;
}


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
    return <div className='jp-Input-Dialog' style={{ height: '100%', width: '100%', alignItems: 'left' }}>
      <form onSubmit={this.handleSubmit} style={{ height: '100%', width: '100%' }}>
       <table style={{ height: '100%', width: '100%' }}>
       <tr >
          <td colSpan={3}>        
          <label>
          <swanProjectIcon.react tag="span" right="7px" top="5px" height="75px" width="75px" />

          <input type="text" placeholder="Project Name" onChange={this.handleChange} />
        </label>
        </td>
      </tr>
      <tr>
        <td colSpan={3}>        
        
        <div>
        <div style={{float:"left"}}>{Card("LCG",null)}</div>
        <div style={{float:"left"}}>{Card("CMSSW",null)}</div>
        <div style={{float:"left"}}>{Card("Conda",null)}</div>
        </div>
        </td>
      </tr>
        {
          //ReleaseAndPlatform("LCG",null)
          
        }
          <tr>
                <td>Release</td>
                <td>Platform</td>
            </tr>
            <tr>
                <td>
                    <select value={"Test"}>
                        <option value="Ford">Ford</option>
                        <option value="Volvo">Volvo</option>
                        <option value="Fiat">Fiat</option>
                    </select>
                </td>
                <td>
                    <select value={"Test"}>
                        <option value="Ford">Ford</option>
                        <option value="Volvo">Volvo</option>
                        <option value="Fiat">Fiat</option>
                    </select>
                </td>
            </tr>
          <tr>
            <td colSpan={2} style={{ alignItems: 'right' }}></td>
              <input  style={{ alignItems: 'right' }} type="submit" value="Add" />
            </tr>
        </table>
      </form>

      {/* <LCGStack visible={this.useStack['LCG'] as boolean}/> */}
      {/* <div><button onClick={this.createProject}>Create</button></div> */}
    </div>;
  }
}
