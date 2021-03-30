// Copyright (c) SWAN Team.
// Author: Omar Zapata CERN 2021

import { Dialog, showErrorMessage, showDialog } from '@jupyterlab/apputils';
import { ProjectWidget } from "./ProjectWidget"
import { JSONObject } from '@lumino/coreutils';
import { Widget } from '@lumino/widgets';
import { request } from './request';

/**
 * Namespace for project dialogs
 */
 export namespace ProjectDialog {
  /**
   * Common constructor options for input dialogs
   */
  export interface IOptions {
    /**
     * The top level text for the dialog.  Defaults to an empty string.
     */
    title?: Dialog.Header;

  }

  /**
   * Constructor options for project dialogs
   */
   export interface ISWANOptions extends IOptions {
    /**
     * Default
     */
    name?: string;
    stack?: string;
    release?: string;
    platform?: string;
    user_script?: string;
    stacks_options?: JSONObject;
  }


function contentRequest(cwd: string): any {
  try {
    return request<any>('api/contents/' + cwd, {
      method: 'GET'
    }).then(rvalue => {
      return rvalue;
    })
  } catch (reason) {
    console.error(
      `Error on GET 'api/contents'+ ${cwd}.\n${reason}`
    );
    return reason;
  }
}


function createProjectRequest(options: ISWANOptions): any {
  //const dataToSend = { name: options.name, stack: options.stack, STACK: stack, PLATFORM: platform, KERNELS: kernels, USER_SCRIPT: userscript };
  var data = JSON.stringify(options)
  console.log("Sending");
  console.log(data);
  try {
    request<any>('swan/project/create', {
      body: data,
      method: 'POST'
    }).then(pvalue => {
      console.log(pvalue);
    });
  } catch (reason) {
    console.error(
      `Error on POST /swan/project/create ${options}.\n${reason}`
    );
  }
}



  /**
   * Create and show a modal dialog to create or modify projects.
   *
   * @param options - The dialog setup options.
   * @param create - true for a new project, false to modify.
   * 
   * @returns A promise that resolves with whether the dialog was accepted
   */
  export async function OpenModal(
    options: ISWANOptions,
    create: boolean
  ): Promise<Dialog.IResult<void>> {

    var dialog = new ProjectWidget(options);
    Widget.attach(dialog, document.body);
    var valid = false;
    do {
      console.log("1-OPTIONS  = ");
      console.log(options);
      dialog.clicked = false;
      var modal = showDialog({
        ...options,
        body: dialog,
        buttons: [],
        focusNodeSelector: 'input',
      });
      await modal.then(async () => { })
      if (dialog.clicked) {
        options = dialog.getOptions();
        console.log("OPTIONS  = ");
        console.log(options);
        if (options.name.trim() != "")//check is project already exists
        {
          var content = await contentRequest("SWAN_projects/" + options.name).catch((response: Response, message: any) => {
          console.log("404 checking project name, means project doesn't exists and it is a valid name.");
          })
          if (content == undefined) {
            valid = true
          } else {
            await showErrorMessage("Invalid project name", "Project already exists.");
            valid = false;
          }
        } else {
          await showErrorMessage("Invalid project name", "Select a valid project name.");
          valid = false;
        }
      } else {
        valid = true;
      }

    }
    while (!valid);
    if (create && dialog.clicked) {
      await createProjectRequest(options);
    }
    return modal as Promise<Dialog.IResult<void>>;
  }
}
