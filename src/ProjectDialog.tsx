// Copyright (c) SWAN Team.
// Author: Omar Zapata CERN 2020

import { Dialog, showDialog } from '@jupyterlab/apputils';
import {ProjectWidget} from "./ProjectWidget"

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
     * Default value
     */
    project_path?: string;
  }
    
  /**
   * Create and show a input dialog for a number.
   *
   * @param options - The dialog setup options.
   *
   * @returns A promise that resolves with whether the dialog was accepted
   */
  export async function OpenModal(
    options: ISWANOptions
  ): Promise<Dialog.IResult<void>> {
    var dialog = new ProjectWidget("","","","","",{});
    var modal = showDialog({
      ...options,
      body: dialog,
      buttons: [  Dialog.okButton({ label:"Add" })],
      focusNodeSelector: 'input',

    })
    // }).then( value => {
    //   console.log('editable item ' + value.value);
    //   var promise = new PromiseDelegate<Dialog.IResult<any>>();
    
    //   return promise.promise;
    // });
    // const result = await modal;

    // if(result.button.accept){
    //   var modal = showDialog({
    //     ...options,
    //     body: dialog,//new ProjectWidget(""),// CreateProjectDialog(options),
    //     // buttons: [],
    //     buttons: [  Dialog.okButton({ label:"Add" })],
    //     focusNodeSelector: 'input'
    //   })
    // }
   return modal as Promise<Dialog.IResult<void>>; 
  }
}
