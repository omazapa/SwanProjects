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
  project_options: ProjectDialog.ISWANOptions;
  releases: JSONObject[];
  platforms: JSONObject[];
  constructor(options:ProjectDialog.ISWANOptions) {
    super();
    this.addClass('jp-ReactWidget');

    this.project_options = options;
    if(this.project_options.project_source  === undefined || this.project_options.project_source  === "")
    {
      this.project_options.project_source = "LCG"
    }
    this.selectSource = this.selectSource.bind(this);
    this.changeStack = this.changeStack.bind(this);
    this.selectSource(this.project_options.project_source);
  }
  selectSource(source: string): void {
    console.log(source);
    this.project_options.project_source = source;
    console.log(this.project_options);

    //check is source on staks else error
    var releases = Object.keys(this.project_options.stacks_options[this.project_options.project_source]) as string[];
    this.releases = [];
    releases.forEach(release => { this.releases.push({value: release, label: release})});

    this.project_options.project_stack = releases[0];
    
    var stack_values = this.project_options.stacks_options[this.project_options.project_source] as JSONObject;
    
    console.log(stack_values);

    //check is stack on keys, else error
    var platforms = stack_values[this.project_options.project_stack] as string[];

    console.log(platforms);

    this.platforms = [];
    platforms.forEach(platform => {this.platforms.push({value: platform, label: platform})});
    this.project_options.project_platform = platforms[0];
    console.log(this.project_options.project_platform);
    console.log(this.project_options.project_stack);

    this.update();
    // this._signal.emit();
  }
  changeStack(event: any): void {
    this.project_options.project_stack = event.value; 
    var stack_values = this.project_options.stacks_options[this.project_options.project_source] as JSONObject;
    //check is stack on keys, else error
    var platforms = stack_values[this.project_options.project_stack] as string[];
    this.platforms = [];
    platforms.forEach(platform => {this.platforms.push({value: platform, label: platform})});
    this.project_options.project_platform = platforms[0];
    this.update();

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
          <input type="text" placeholder="Project Name" style={{ width: '100%', padding: "5px 0px 5px 0px", }} onChange={this.handleChange} />
          </div>
      </td>

      </tr>
      <tr>
        <td colSpan={1}>        
        <div style={{float:"left"}}>{Card("LCG",sftIcon,this.selectSource)}</div>
        </td>
        <td colSpan={1}>
          <div style={{float:"left"}}>{Card("CMSSW",cmsIcon,this.selectSource)}</div>        
          </td> 
        <td colSpan={1}>
        <div style={{float:"left"}}>{Card("Conda",condaIcon,this.selectSource)}</div>          
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
                {/* <UseSignal signal={this._signal} > */}
                  {/* {() =>   */}
                  <Select 
                    isSearchable={false} 
                    options={this.releases as any} 
                    menuPortalTarget={document.body} 
                    menuPosition={'absolute'} 
                    styles={{ menuPortal: base => ({ ...base, zIndex: 999999 }) }}  
                    menuShouldScrollIntoView={false}
                    defaultValue={{value:this.project_options.project_stack,label:this.project_options.project_stack}}
                    value={{value:this.project_options.project_stack,label:this.project_options.project_stack}}
                    onChange={this.changeStack}
                    />
                    {/* } */}
                {/* </UseSignal> */}
                </td>
                <td colSpan={2} style={{width:"50%"}}>
                  {<Select 
                    isSearchable={false} 
                    options={this.platforms as any} 
                    menuPortalTarget={document.body}  
                    menuPosition={'absolute'} 
                    styles={{ menuPortal: base => ({ ...base, zIndex: 999999 }) }}  
                    menuShouldScrollIntoView={false}
                    defaultValue={{value:this.project_options.project_platform,label:this.project_options.project_platform}}
                    value={{value:this.project_options.project_platform,label:this.project_options.project_platform}}
                    
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
              <input type="text" placeholder="Bash User Script" style={{ width: '100%', padding: "5px 0px 5px 0px", }} />
              </div>
              
            </td>              

            </tr>
          </tbody>
        </table>
    </span>;
  }

}
