// import { ReactWidget, UseSignal } from '@jupyterlab/apputils';
import { ReactWidget } from '@jupyterlab/apputils';
import * as React from "react";
import { JSONObject } from '@lumino/coreutils';
import {Card,HelpTooltip} from './Components'
export interface IStackOptions {
  visible: boolean;
}
import {swanProjectIcon,sftIcon,cmsIcon,condaIcon} from './icons'

import {ProjectDialog} from "./ProjectDialog"

import Select from 'react-select'

/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class ProjectWidget extends ReactWidget {
  /**
   * Constructs a new CounterWidget.
   */
  options: ProjectDialog.ISWANOptions;
  releases: JSONObject[];
  platforms: JSONObject[];
  clicked:boolean;
  constructor(options:ProjectDialog.ISWANOptions) {
    super();
    this.clicked = false;
    this.addClass('jp-ReactWidget');
    this.setOptions(options);
    this.selectStack = this.selectStack.bind(this);
    this.changeRelease = this.changeRelease.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeUserScript = this.changeUserScript.bind(this);
    this.changeClicked = this.changeClicked.bind(this);
  }

  getOptions():ProjectDialog.ISWANOptions
  {
    return this.options;
  }
  setOptions(options:ProjectDialog.ISWANOptions)
  {
    this.options = options;
    if(this.options.stack  === undefined || this.options.stack  === "")
    {
      this.options.stack = "LCG"
    }
    this.selectStack(this.options.stack);
    this.update();
  }

  selectStack(source: string): void {
    console.log(source);
    this.options.stack = source;
    console.log(this.options);

    //check is source on staks else error
    var releases = Object.keys(this.options.stacks_options[this.options.stack]) as string[];
    this.releases = [];
    releases.forEach(release => { this.releases.push({value: release, label: release})});

    this.options.release = releases[0];
    
    var stack_values = this.options.stacks_options[this.options.stack] as JSONObject;
    
    console.log(stack_values);

    //check is stack on keys, else error
    var platforms = stack_values[this.options.release] as string[];

    console.log(platforms);

    this.platforms = [];
    platforms.forEach(platform => {this.platforms.push({value: platform, label: platform})});
    this.options.platform = platforms[0];
    console.log(this.options.platform);
    console.log(this.options.release);

    this.update();
    // this._signal.emit();
  }
  changeRelease(event: any): void {
    this.options.release = event.value; 
    var stack_values = this.options.stacks_options[this.options.stack] as JSONObject;
    //check is stack on keys, else error
    var platforms = stack_values[this.options.release] as string[];
    this.platforms = [];
    platforms.forEach(platform => {this.platforms.push({value: platform, label: platform})});
    this.options.platform = platforms[0];
    this.update();

  }

  changeName(event:any)
  {
    this.options.name = event.target.value;
  }

  changeUserScript(event:any)
  {
    this.options.user_script = event.target.value;
  }
  changeClicked()
  {
    this.clicked=true;
    this.parent.parent.close();
  }
  render(): JSX.Element {
   
    return <span className='jp-Dialog-body' style={{ minHeight: '300px',minWidth: '420px'}}>
       <table style={{height: '100%', width: '98%' }}>
       <tbody>
       <tr >
          <td>                    
          <swanProjectIcon.react tag="span" width="50px" right="7px" top="5px"  />
        </td>
        <td colSpan={3}>
        <div style={{ width: '100%', padding: "5px 5px 5px 0px", }}>
          <input type="text" 
                 defaultValue={this.options.name} 
                 placeholder="Project Name" 
                 style={{ width: '100%', padding: "5px 0px 5px 0px", }} 
                 onChange={this.changeName} />
          </div>
      </td>

      </tr>
      <tr>
        <td colSpan={1}>        
        <div style={{float:"left"}}>{Card("LCG",sftIcon,this.selectStack)}</div>
        </td>
        <td colSpan={1}>
          <div style={{float:"left"}}>{Card("CMSSW",cmsIcon,this.selectStack)}</div>        
          </td> 
        <td colSpan={1}>
        <div style={{float:"left"}}>{Card("Conda",condaIcon,this.selectStack)}</div>          
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
                                              all the software packages included in the LCG/CMSSW <br/>\
                                              release that you selected.")} </div>  
                </div>
                </td>
                <td colSpan={2}>Platform</td>
            </tr>
            <tr style={{width:"100%"}}>
                {/* https://react-select.com/advanced#portaling */}
                <td colSpan={2} style={{width:"50%"}}>
                  <Select 
                    isSearchable={false} 
                    options={this.releases as any} 
                    menuPortalTarget={document.body} 
                    menuPosition={'absolute'} 
                    styles={{ menuPortal: base => ({ ...base, zIndex: 999999 }) }}  
                    menuShouldScrollIntoView={false}
                    defaultValue={{value:this.options.release,label:this.options.release}}
                    value={{value:this.options.release,label:this.options.release}}
                    onChange={this.changeRelease}
                    />
                </td>
                <td colSpan={2} style={{width:"50%"}}>
                  {<Select 
                    isSearchable={false} 
                    options={this.platforms as any} 
                    menuPortalTarget={document.body}  
                    menuPosition={'absolute'} 
                    styles={{ menuPortal: base => ({ ...base, zIndex: 999999 }) }}  
                    menuShouldScrollIntoView={false}
                    defaultValue={{value:this.options.platform,label:this.options.platform}}
                    value={{value:this.options.platform,label:this.options.platform}}
                    
                    />}
                </td>
            </tr>
            <tr>
            <td colSpan={4}>
              <div style={{display:"flex"}}>
              <div> Bash Script  </div>
              <div> {HelpTooltip("bash_script","User Script")} </div>  
              </div> <br/>
              <div style={{ width: '100%' }}>
              <input className="user_script" type="text" 
                     placeholder="Bash User Script" 
                     style={{ width: '100%', padding: "5px 0px 5px 0px", }}  
                     onChange={this.changeUserScript}
                     defaultValue={this.options.user_script}
                     />
              </div>
              
            </td>              

            </tr>
            <tr>
            <td colSpan={4}>
            <div style={{float:"right"}}>
              <button type="button" className="jp-mod-styled" onClick={this.changeClicked}>Add</button>
            </div>
            </td>
           </tr>
          </tbody>
        </table>
    </span>;
  }

}
