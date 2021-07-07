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
 * React ProjectWidget.
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

  /**
   * returns the project values, such as name, stack, release ...
   */
  getOptions(): ProjectDialog.ISWANOptions {
    return this.options;
  }

  /**
   * fill the form with project values, such as name, stack, release ...
   */
  setOptions(options: ProjectDialog.ISWANOptions): void {
    this.options = options;
    if (this.options.stack === undefined || this.options.stack === '') {
      this.options.stack = 'LCG';
    }
    this.selectStack(this.options.stack);
    this.update();
  }

  /**
   * method to change stack, allows to handle the information
   * in the Select component for platform and release
   */
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

  /**
   * method to change release in the Select component
   */
  changeRelease(event: { value: string; label: string }): void {
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

  /**
   * method to change platform in the Select component
   */
  changePlatform(event: { value: string; label: string }): void {
    this.options.platform = event.value;

    this.update();
  }

  /**
   * method to change name in the input text.
   */
  changeName(event: React.ChangeEvent<HTMLInputElement>): void {
    this.options.name = event.target.value;
  }

  /**
   * method to change text in the text area for the user script.
   */
  changeUserScript(event: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.options.user_script = event.target.value;
  }

  /**
   * method to indicated that the
   */
  changeClicked(): void {
    this.clicked = true;
    this.parent.parent.close();
  }

  render(): JSX.Element {
    return (
      <>
        <div className="sw-Dialog-project-name">
          <swanProjectIcon.react
            className="sw-Dialog-project-icon"
            tag="span"
          />
          <input
            type="text"
            defaultValue={this.options.name}
            placeholder="Project Name"
            onChange={this.changeName}
          />
        </div>
        <div className="sw-Dialog-select-stack">
          <Card label="LCG" icon={sftIcon} updateCallback={this.selectStack} />
          <Card
            label="CMSSW"
            icon={cmsIcon}
            updateCallback={this.selectStack}
          />
        </div>
        <div className="sw-Dialog-stack-options">
          <div>
            <div className="sw-Dialog-stack-option-label">
              <span> Release </span>
              <span className="sw-Dialog-release-tooltip">
                <HelpTooltip
                  id="release"
                  message="Software stack: TODO! <br/> \
                                    No message yet.<br/> \
                                    ;("
                />
              </span>
            </div>
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
          </div>
          <div>
            <div className="sw-Dialog-stack-option-label">
              <span> Platform </span>
              <span className="sw-Dialog-release-tooltip">
                <HelpTooltip
                  id="release"
                  message="Platform: TODO! <br/> \
                                    No message yet.<br/> \
                                    ;("
                />
              </span>
            </div>
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
          </div>
        </div>
        <div className="sw-Dialog-userscript">
          <div className="sw-Dialog-userscript-title">
            <div> User environment </div>
            <div className="sw-Dialog-userscript-tooltip">
              <HelpTooltip id="bash_script" message="User environment script" />
            </div>
          </div>
          <textarea
            placeholder="#!/bin/bash &#10;Bash user script code here"
            onChange={this.changeUserScript}
            defaultValue={this.options.user_script}
          />
        </div>
        <div className="sw-Dialog-button-area">
          <button
            type="button"
            className="jp-mod-styled sw-Dialog-button"
            onClick={this.changeClicked}
          >
            Create Project
          </button>
        </div>
      </>
    );
  }
}
