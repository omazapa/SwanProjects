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
    value?: string;
  }
    
  /**
   * Create and show a input dialog for a number.
   *
   * @param options - The dialog setup options.
   *
   * @returns A promise that resolves with whether the dialog was accepted
   */
  export function OpenModal(
    options: ISWANOptions
  ): Promise<Dialog.IResult<void>> {
    return showDialog({
      ...options,
      body: new ProjectWidget(""),// CreateProjectDialog(options),
      buttons: [],
      focusNodeSelector: 'input'
    });
  }
}
