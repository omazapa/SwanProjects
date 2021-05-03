// Copyright (c) SWAN Team.
// Author: Omar Zapata CERN 2021

import { Dialog, showErrorMessage, showDialog } from './dialog';
import { ProjectWidget } from './ProjectWidget';
import { JSONObject } from '@lumino/coreutils';
//import { Widget } from '@lumino/widgets';
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
    const oldName = options.name;
    const dialog = new ProjectWidget(options);
    /**
     *
     */
    function startSpinner(): void {
      const node = document.getElementById('jp-main-dock-panel');
      node.appendChild(_spinner.node);
      node.focus();
      _spinner.activate();
      _spinner.show();
      _spinner.node.focus();
    }

    /**
     *
     */
    function stopSpinner(): void {
      _spinner.hide();
    }

    //Widget.attach(dialog, document.body);
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
        if (options.name.trim() !== '') {
          //check is project already exists
          if (create) {
            const content = await contentRequest(
              'SWAN_projects/' + options.name
            ).catch((response: Response, message: any): void => {
              console.log(
                "404 checking project name, means project doesn't exists and it is a valid name."
              );
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
            if (oldName !== options.name) {
              const content = await contentRequest(
                'SWAN_projects/' + options.name
              ).catch((response: Response, message: any) => {
                console.log(
                  "404 checking project name, means project doesn't exists and it is a valid name."
                );
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
              valid = true;
            }
          }
        }

        if (options.name.trim() === '') {
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
    let result: any = null;
    if (dialog.clicked) {
      startSpinner();
      if (create) {
        result = await createProjectRequest(options).then((value: any) => {
          commands.execute('filebrowser:go-to-path', {
            path: value['project_dir'],
            showBrowser: true
          });
          return value;
        });
      } else {
        if (oldName !== options.name) {
          result = commands
            .execute('filebrowser:go-to-path', {
              path: '/SWAN_projects',
              showBrowser: true
            })
            .then(() => {
              return editProjectRequest(oldName, options).then((value: any) => {
                return commands.execute('filebrowser:go-to-path', {
                  path: value['project_dir'],
                  showBrowser: true
                });
              });
            });
        } else {
          result = editProjectRequest(oldName, options).then((value: any) => {
            return commands.execute('filebrowser:go-to-path', {
              path: value['project_dir'],
              showBrowser: true
            });
          });
        }
        await result;
      }
      stopSpinner();
    }
    return result;
  }
}
