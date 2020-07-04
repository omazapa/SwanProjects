import { ReactWidget } from "@jupyterlab/apputils";
import * as React from "react";

//import { useState } from 'react';
import {
    JupyterFrontEnd
  } from '@jupyterlab/application';
/**
 * React component for a counter.
 *
 * @returns The React component
 */

type KerneProps = {
app:JupyterFrontEnd,
cwd:string
}
const FACTORY = 'Editor';
const LaunchKernel = (props:KerneProps): JSX.Element => {

  return (
    <div>
      <button
        onClick={(): void => {
          const services = props.app.serviceManager;
          services.ready.then(() => {
            return commands.execute('notebook:create-new', {
              path: props.cwd,
              factory: FACTORY,
              kernel: { name: 'slc7_amd64_gcc820_cmssw_11_0_0_python3' },
              kernelName:'slc7_amd64_gcc820_cmssw_11_0_0_python3'
            });
          });const {commands} = props.app
            
        }}
      >
        Open Notebook
      </button>
    </div>
  );
};

/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class ProjectWidget extends ReactWidget {
  /**
   * Constructs a new CounterWidget.
   */
  app:JupyterFrontEnd;
  cwd:string;
  constructor(app: JupyterFrontEnd,cwd:string) {
    super();
    this.addClass('jp-ReactWidget');
    this.app = app;
  }

  render(): JSX.Element {
    return <LaunchKernel app={this.app} cwd={this.cwd}/>;
  }
}
