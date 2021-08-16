// Copyright (c) SWAN Team.
// Author: Omar Zapata CERN 2021

import { showErrorMessage } from '@jupyterlab/apputils';
import { Dialog, showDialog } from './dialog';
import { ProjectWidget } from './ProjectWidget';
import { JSONObject } from '@lumino/coreutils';
import {
  contentRequest,
  createProjectRequest,
  editProjectRequest
} from './request';
import { Spinner } from '@jupyterlab/apputils';
import { CommandRegistry } from '@lumino/commands';
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
   * options for project dialogs
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
    corrupted?: boolean;
  }

  /**
   * variables from backend response
   */
  export interface ISWANReqResponse {
    status: boolean;
    project_dir: string;
    msg: string;
  }

  /**
   * Create and show a modal dialog to create or modify projects.
   *
   * @param options - The dialog setup options.
   * @param create - true for a new project, false to modify.
   * @param commands - CommandRegistry object
   * @returns A promise that resolves with whether the dialog was accepted
   */
  // eslint-disable-next-line  no-inner-declarations
  export async function OpenModal(
    options: ISWANOptions,
    create: boolean,
    commands: CommandRegistry
  ): Promise<any> {
    const _spinner = new Spinner();
    const old_options = Object.assign({}, options);
    const dialog = new ProjectWidget(options);

    function startSpinner(): void {
      /**
       * Function to start the spiner in the SwanLauncer, embed in the html tag with id jp-main-dock-panel.
       */
      const node = document.getElementById('jp-main-dock-panel');
      node?.appendChild(_spinner.node);
      node?.focus();
      _spinner.activate();
      _spinner.show();
      _spinner.node.focus();
    }

    /**
     * hides the spiner from the component
     */
    function stopSpinner(): void {
      _spinner.hide();
    }

    let valid = false;
    do {
      dialog.clicked = false;
      const modal = showDialog({
        ...options,
        body: dialog,
        buttons: [],
        focusNodeSelector: 'input'
      });
      await modal;
      if (dialog.clicked) {
        options = dialog.getOptions();
        if (options.name?.trim() !== '') {
          //check is project already exists
          if (create) {
            const content = await contentRequest(
              'SWAN_projects/' + options.name
            ).catch((): void => {
              //not message here, it is not needed,
              //I am checking if the directory doesn't exist in order
              //to make valid the creation of the project folder.
            });
            if (content === undefined) {
              valid = true;
            } else {
              await showErrorMessage(
                'Invalid project name',
                'Project already exists.'
              );
              valid = false;
            }
          } else {
            if(options.corrupted)
            {
              valid=true;
              break
            }
            //this is a special case for editing because I need to check that the new name of the project doesn't exists.
            if (old_options.name !== options.name) {
              const content = await contentRequest(
                'SWAN_projects/' + options.name
              ).catch(() => {
                //not message here, it is not needed,
                //I am checking if the directory doesn't exist in order
                //to make valid the edition of the name of the project folder.
              });
              if (content === undefined) {
                valid = true; //folder doesn't exists, then I can to raname the project.
              } else {
                await showErrorMessage(
                  'Invalid project name',
                  'Project already exists.'
                );
                valid = false;
              }
            }

            //verifying that options where changed, othewise I will not send the request
            if ( JSON.stringify(old_options) !== JSON.stringify(options) ) {
              valid = true;
            } else {
              valid = false;
            }
          }
        }

        if (options.name?.trim() === '') {
          await showErrorMessage(
            'Invalid project name',
            'Select a valid (non-empty) project name.'
          );
          valid = false;
        }
      } else {
        valid = true;
      }
    } while (!valid);
    const result: any = null;
    if (dialog.clicked) {
      startSpinner();
      if (create) {
        await createProjectRequest(options)
          .then((res: ISWANReqResponse) => {
            if (res.status) {
              commands.execute('filebrowser:go-to-path', {
                path: res.project_dir,
                showBrowser: false
              });
            } else {
              stopSpinner();
              showErrorMessage('Error creating project', res.msg);
            }
            return res;
          })
          .catch((msg: any): void => {
            stopSpinner();
            showErrorMessage('Error creating project', msg);
          });
      } else {
        await commands
          .execute('filebrowser:go-to-path', {
            path: '/SWAN_projects',
            showBrowser: false
          })
          .then(async () => {
            await editProjectRequest(old_options, options)
              .then(async (res: ISWANReqResponse) => {
                if (res.status) {
                  await commands
                    .execute('filebrowser:go-to-path', {
                      path: res.project_dir,
                      showBrowser: false
                    })
                    .catch((msg: any) => {
                      stopSpinner();
                      console.log(
                        'Error moving from edited project  ' + old_options.name
                      );
                      console.log(msg);
                    });
                } else {
                  stopSpinner();
                  showErrorMessage('Error editing project', res.msg);
                }
                return res;
              })
              .catch((msg: any) => {
                stopSpinner();
                console.log('Error editing project: ' + old_options.name);
                console.log(msg);
              });
          })
          .catch((msg: any) => {
            stopSpinner();
            console.log(
              'Error moving to /SWAN_projects to edit the project: ' +
                old_options.name
            );
            console.log(msg);
          });
      }
      stopSpinner();
    }
    return result;
  }
}
