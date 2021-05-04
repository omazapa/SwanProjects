// Copyright (c) SWAN Development Team.
// Author: Omar.Zapata@cern.ch 2021
import { ReactWidget } from '@jupyterlab/apputils';
import * as React from 'react';
import { JSONObject } from '@lumino/coreutils';
import { Card, HelpTooltip } from './Components';
export interface IStackOptions {
  visible: boolean;
}
import { swanProjectIcon, sftIcon, cmsIcon } from './icons';

import { ProjectDialog } from './ProjectDialog';

import Select from 'react-select';

/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class ProjectWidget extends ReactWidget {
  /**
   * Constructs a new ProjectWidget.
   */
  options: ProjectDialog.ISWANOptions;
  releases: JSONObject[];
  platforms: JSONObject[];
  clicked: boolean;
  constructor(options: ProjectDialog.ISWANOptions) {
    super();
    this.clicked = false;
    this.addClass('jp-ReactWidget');
    this.setOptions(options);
    this.selectStack = this.selectStack.bind(this);
    this.changeRelease = this.changeRelease.bind(this);
    this.changePlatform = this.changePlatform.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeUserScript = this.changeUserScript.bind(this);
    this.changeClicked = this.changeClicked.bind(this);

  }

  getOptions(): ProjectDialog.ISWANOptions {
    return this.options;
  }
  setOptions(options: ProjectDialog.ISWANOptions): void {
    this.options = options;
    if (this.options.stack === undefined || this.options.stack === '') {
      this.options.stack = 'LCG';
    }
    this.selectStack(this.options.stack);
    this.update();
  }

  selectStack(source: string): void {
    this.options.stack = source;

    //check is source on staks else error
    const releases = Object.keys(
      this.options.stacks_options[this.options.stack]
    ) as string[];
    this.releases = [];
    releases.forEach(release => {
      this.releases.push({ value: release, label: release });
    });

    this.options.release = releases[0];

    const stackValues = this.options.stacks_options[
      this.options.stack
    ] as JSONObject;

    //check is stack on keys, else error
    const platforms = stackValues[this.options.release] as string[];

    this.platforms = [];
    platforms.forEach(platform => {
      this.platforms.push({ value: platform, label: platform });
    });
    this.options.platform = platforms[0];

    this.update();
  }
  changeRelease(event: any): void {
    this.options.release = event.value;
    const stackValues = this.options.stacks_options[
      this.options.stack
    ] as JSONObject;
    //check is stack on keys, else error
    const platforms = stackValues[this.options.release] as string[];
    this.platforms = [];
    platforms.forEach(platform => {
      this.platforms.push({ value: platform, label: platform });
    });
    this.options.platform = platforms[0];
    this.update();
  }
  changePlatform(event: any): void {
    this.options.platform = event.value;
    
    console.log(event);
    this.update();
  }

  changeName(event: any): void {
    this.options.name = event.target.value;
  }

  changeUserScript(event: any): void {
    this.options.user_script = event.target.value; // eslint-disable-line @typescript-eslint/camelcase
  }
  changeClicked(): void {
    this.clicked = true;
    this.parent.parent.close();
  }
  render(): JSX.Element {
    return (
      <span
        className="jp-Dialog-body"
        style={{ minHeight: '300px', minWidth: '420px' }}
      >
        <table style={{ height: '100%', width: '95%' }} cellSpacing="0">
          <tbody style={{resize: 'horizontal'}}>
            <tr>
              <td align="center">
                <swanProjectIcon.react
                  tag="span"
                  width="50px"
                  right="7px"
                  top="5px"
                />
              </td>
              <td colSpan={3}>
                <div style={{ width: '100%', padding: '5px 5px 5px 0px' }}>
                  <input
                    type="text"
                    defaultValue={this.options.name}
                    placeholder="Project Name"
                    style={{
                      width: '100%',
                      padding: '5px 0px 5px 0px',
                      textIndent: '10px'
                    }}
                    onChange={this.changeName}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={1}>
                <div style={{ float: 'left' }}>
                  {Card('LCG', sftIcon, this.selectStack)}
                </div>
              </td>
              <td colSpan={1}>
                <div style={{ float: 'left' }}>
                  {Card('CMSSW', cmsIcon, this.selectStack)}
                </div>
              </td>
              <td colSpan={1}>
                {/* <div style={{ float: 'left' }}>
                  {Card('Conda', condaIcon, this.selectStack)}
                </div> */}
              </td>
              <td colSpan={1}></td>
            </tr>
            <tr>
              <td colSpan={2} style={{width: '48%', padding: '10px 0px 0px 2%'}}>
                <br />
                <div style={{ display: 'flex' }}>
                  <div> Release </div>
                  <div>
                    {' '}
                    {HelpTooltip(
                      'release',
                      'Software stack: TODO! <br/> \
                                    No message yet.<br/> \
                                    ;('
                    )}{' '}
                  </div>
                </div>
              </td>
              <td colSpan={2}  style={{width: '48%', padding: '10px 0px 0px 2%'}}>
                <br />
                Platform
              </td>
            </tr>
            <tr style={{ width: '100%', maxHeight: '40px' }}>
              {/* https://react-select.com/advanced#portaling */}
              <td colSpan={2} style={{ width: '50%' }}>
                <Select
                  isSearchable={false}
                  options={this.releases as any}
                  menuPortalTarget={document.body}
                  menuPosition={'absolute'}
                  styles={{
                    menuPortal: (base: any): any => ({
                      ...base,
                      zIndex: 999999
                    })
                  }}
                  menuShouldScrollIntoView={false}
                  defaultValue={{
                    value: this.options.release,
                    label: this.options.release
                  }}
                  value={{
                    value: this.options.release,
                    label: this.options.release
                  }}
                  onChange={this.changeRelease}
                />
              </td>
              <td colSpan={2} style={{ width: '50%' }}>
                {
                  <Select
                    isSearchable={false}
                    options={this.platforms as any}
                    menuPortalTarget={document.body}
                    menuPosition={'absolute'}
                    styles={{
                      menuPortal: (base: any): any => ({
                        ...base,
                        zIndex: 999999
                      })
                    }}
                    menuShouldScrollIntoView={false}
                    defaultValue={{
                      value: this.options.platform,
                      label: this.options.platform
                    }}
                    value={{
                      value: this.options.platform,
                      label: this.options.platform
                    }}
                    onChange={this.changePlatform}
                  />
                }
              </td>
            </tr>
            <tr>
              <td colSpan={4} style={{ padding: '15px 0px 0px 0px'}}>
                <div style={{ display: 'flex', padding: '0px 0px 5px 0px'}}>
                  <div> User environment </div>
                  <div>
                    {' '}
                    {HelpTooltip('bash_script', 'User environment script')}{' '}
                  </div>
                </div>
                <div style={{ width: '100%', height: '100%',minHeight:'100%' }}>
                  <textarea
                    className="userScript"
                    placeholder="Bash User Script"
                    style={{
                      width: '100%',
                      height: '100%',
                      minWidth: '420px',
                      minHeight: '300px',
                      padding: '5px 0px 5px 0px',
                      resize: 'none'
                    }}
                    onChange={this.changeUserScript}
                    defaultValue={this.options.user_script}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={4}>
                <div style={{ float: 'right' }}>
                <br />
                <br />
                  <button
                    type="button"
                    className="jp-mod-styled"
                    onClick={this.changeClicked}
                  >
                    Add
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </span>
    );
  }
}
