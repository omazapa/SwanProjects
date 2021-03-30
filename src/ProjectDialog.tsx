// Copyright (c) SWAN Team.
// Author: Omar Zapata CERN 2021

import { Dialog, showErrorMessage,showDialog } from '@jupyterlab/apputils';
import { ProjectWidget } from "./ProjectWidget"
import { JSONObject } from '@lumino/coreutils';
import { Widget } from '@lumino/widgets';
import { request } from './request';


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
/**
 * Create and show a dialog.
 *
 * @param options - The dialog setup options.
 *
 * @returns A promise that resolves with whether the dialog was accepted.
 */
//  export function showDialog<T>(
//   options: Partial<Dialog.IOptions<T>> = {}
// ): Promise<Dialog.IResult<T>> {
//   options.buttons[0].accept = false;
//   const dialog = new Dialog(options);
//   return dialog.launch();
// }


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
   * Constructor options for number input dialogs
   */
  export interface ISWANOptions extends IOptions {
    /**
     * Default
     */
    //project_path?: string;
    project_name?: string;
    project_source?: string;
    project_stack?: string;
    project_platform?: string;
    project_user_script?: string;
    stacks_options?: JSONObject;
  }

  /**
   * Create and show a input dialog for a number.
   *
   * @param options - The dialog setup options.
   *
   * @returns A promise that resolves with whether the dialog was accepted
   */
  export async function OpenModal(
    options: ISWANOptions,
    create: boolean
  ): Promise<Dialog.IResult<void>> {

    // var button = Dialog.okButton({label:"Add",className:"AddButton"});
    
    
    var dialog = new ProjectWidget(options);
    Widget.attach(dialog, document.body);
    var valid = false;
    do {
      console.log("1-OPTIONS  = ");
      console.log(options);
      //dialog.setOptions(options);
      dialog.clicked = false;
      var modal = showDialog({
        ...options,
        body: dialog,
        buttons: [],
        focusNodeSelector: 'input',
      });
      //const result = await dialog;
      console.log("button accept " + dialog.clicked);
      await modal.then(async () => {})
      console.log("button accept " + dialog.clicked);
      if (dialog.clicked) {
        options = dialog.getOptions();
        console.log("OPTIONS  = ");
        console.log(options);
        if (options.project_name.trim() != "")//check is project already exists
        {
          // try {
          var content = await contentRequest("SWAN_projects/" + options.project_name).catch((response: Response, message: any) => {
            console.log("404 checking project name, means project doesn't exists and it is a valid name.");
            //console.log(response);
          })
          if (content == undefined) {
            valid=true
          } else {
            await showErrorMessage("Invalid project name", "Project already exists.");
            valid= false;
          }
        } else {
          await showErrorMessage("Invalid project name", "Select a valid project name.");
          valid=false;
        }
      } else {
        valid= true;
      }

    }
    while (!valid);
    if (create && dialog.clicked) {
      //showErrorMessage("Invalid project name","Select a valid project name.");

    }
    return modal as Promise<Dialog.IResult<void>>;
  }
}
