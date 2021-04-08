// Copyright (c) SWAN Team.
// Author: Omar Zapata CERN 2021

import { Dialog, showErrorMessage, showDialog } from '@jupyterlab/apputils';
import { ProjectWidget } from "./ProjectWidget";
import { JSONObject } from '@lumino/coreutils';
//import { Widget } from '@lumino/widgets';
import { request } from './request';
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
   * @param cwd
   */
  function contentRequest(cwd: string): any {
    try {
      return request<any>('api/contents/' + cwd, {
        method: 'GET',
      }).then((rvalue) => {
        return rvalue;
      });
    } catch (reason) {
      console.error(`Error on GET 'api/contents'+ ${cwd}.\n${reason}`);
      return reason;
    }
  }

  /**
   * @param options
   */
  function createProjectRequest(options: ISWANOptions): any {
    const dataToSend = {
      name: options.name,
      stack: options.stack,
      release: options.release,
      platform: options.platform,
      user_script: options.user_script,
    };
    try {
      return request<any>('swan/project/create', {
        body: JSON.stringify(dataToSend),
        method: 'POST',
      }).then((rvalue) => {
        console.log("-create-post");
        console.log(rvalue);
        return rvalue;
      });
    } catch (reason) {
      console.error(
        `Error on POST /swan/project/create ${options}.\n${reason}`
      );
    }
  }

  /**
   * @param old_name
   * @param options
   */
  function editProjectRequest(old_name: string, options: ISWANOptions): any {
    const dataToSend = {
      old_name: old_name,
      name: options.name,
      stack: options.stack,
      release: options.release,
      platform: options.platform,
      user_script: options.user_script,
    };
    try {
      return request<any>('swan/project/edit', {
        body: JSON.stringify(dataToSend),
        method: 'POST',
      }).then((rvalue) => {
        return rvalue;
      });
    } catch (reason) {
      console.error(
        `Error on POST 'swan/project/edit'+ ${dataToSend}.\n${reason}`
      );
    }
  }

  /**
   * Create and show a modal dialog to create or modify projects.
   *
   * @param options - The dialog setup options.
   * @param create - true for a new project, false to modify.
   * @param commands
   * @returns A promise that resolves with whether the dialog was accepted
   */
  export async function OpenModal(
    options: ISWANOptions,
    create: boolean,
    commands: CommandRegistry
  ): Promise<any> {
    const _spinner = new Spinner();
    const old_name = options.name;
    const dialog = new ProjectWidget(options);
    /**
     *
     */
    function startSpinner() {
      const node = document.getElementById("jp-main-dock-panel");
      node.appendChild(_spinner.node);
      node.focus();
      _spinner.activate();
      _spinner.show();
      _spinner.node.focus();
    }

    /**
     *
     */
    function stopSpinner() {
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
        focusNodeSelector: 'input',
      });
      await modal.then(async () => {});
      if (dialog.clicked) {
        options = dialog.getOptions();
        if (options.name.trim() != '') {
          //check is project already exists
          if (create) {
            var content = await contentRequest(
              'SWAN_projects/' + options.name
            ).catch((response: Response, message: any) => {
              console.log(
                "404 checking project name, means project doesn't exists and it is a valid name."
              );
            });
            if (content == undefined) {
              valid = true;
            } else {
              await showErrorMessage(
                'Invalid project name',
                'Project already exists.'
              );
              valid = false;
            }
          } else {
            if (old_name != options.name) {
              var content = await contentRequest(
                'SWAN_projects/' + options.name
              ).catch((response: Response, message: any) => {
                console.log(
                  "404 checking project name, means project doesn't exists and it is a valid name."
                );
              });
              if (content == undefined) {
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

        if (options.name.trim() == '') {
          await showErrorMessage(
            "Invalid project name",
            "Select a valid (non-empty) project name."
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
        result = await createProjectRequest(options);
      } else {
        if (old_name != options.name) {
          result = commands
            .execute('filebrowser:go-to-path', {
              path: '/SWAN_projects',
              showBrowser: true,
            })
            .then(() => {
              return editProjectRequest(old_name, options).then(
                (value: any) => {
                  console.log("Project EDITED ===========");
                  console.log(value);
                  return commands.execute('filebrowser:go-to-path', {
                    path: value["project_dir"],
                    showBrowser: true,
                  });
                }
              );
            });
        } else {
          result = editProjectRequest(old_name, options).then((value: any) => {
            console.log("Project EDITED ===========");
            console.log(value);
            return commands.execute('filebrowser:go-to-path', {
              path: value["project_dir"],
              showBrowser: true,
            });
          });
        }
        await result;
        // console.log(await contentRequest(result["project_dir"]));

        // console.log("Project EDITED ===========");
        // console.log(await contentRequest(result["project_dir"]));
        // console.log("Project EDITED END ===========");
      }
      stopSpinner();
    }
    //return modal as Promise<Dialog.IResult<void>>;
    return result;
  }
}
