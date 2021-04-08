import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

//import { MainAreaWidget,ICommandPalette} from '@jupyterlab/apputils';
import { ICommandPalette } from '@jupyterlab/apputils';
//import { PageConfig } from '@jupyterlab/coreutils';

//import { requestAPI } from './jlabextexample';

//import { LabIcon } from '@jupyterlab/ui-components';
//import {swanProjectIcon,cmsIcon} from './icons'
import { swanProjectIcon } from './icons';

//import { InputDialog, Dialog } from '@jupyterlab/apputils';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

//import ProjectLauncher from './launcher'

const PALETTE_CATEGORY = 'Project';

//import {ProjectWidget} from './ProjectWidget'

import { ProjectDialog } from './ProjectDialog';
/*import { JSONObject} from '@lumino/coreutils';
import {
  each
} from '@lumino/algorithm';
*/
/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const project_dialog = 'swan:create-project-dialog';
  export const project_dialog_edit = 'swan:edit-project-dialog';
}

import { ILauncher } from '@jupyterlab/launcher';
//import { launcherIcon } from '@jupyterlab/ui-components';

//import { toArray } from '@lumino/algorithm';
//import { JSONObject } from '@lumino/coreutils';
//import { Widget } from '@lumino/widgets';
import { request } from './request';

export { request };

/**
 *
 */
export function kernelsInfoRequest(): any {
  try {
    return request<any>('swan/stacks/info', {
      method: 'GET',
    }).then((rvalue) => {
      console.log(rvalue);
      return rvalue;
    });
  } catch (reason) {
    console.error(`Error on GET 'swan/stacks/info'.\n${reason}`);
  }
}

/**
 * Initialization data for the server-extension-example extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'server-extension-example',
  autoStart: true,
  optional: [ILauncher],
  requires: [ICommandPalette],
  activate: async (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    launcher: ILauncher | null,
    labShell: ILabShell,
    browserFactory: IFileBrowserFactory
  ) => {
    console.log("SWAN Projects Activated");
    // const manager = app.serviceManager;
    //const { commands, shell } = app;
    const { commands } = app;
    commands.addCommand(CommandIDs.project_dialog, {
      icon: swanProjectIcon,
      label: 'New',
      caption: 'New',
      execute: async (args) => {
        const stacks = await kernelsInfoRequest();
        ProjectDialog.OpenModal(
          {
            name: '',
            stack: '',
            release: '',
            platform: '',
            user_script: '',
            stacks_options: stacks['stacks'],
          },
          true,
          commands
        );
      },
    });

    commands.addCommand(CommandIDs.project_dialog_edit, {
      icon: swanProjectIcon,
      label: 'Edit',
      caption: 'Edit',
      execute: async (args) => {
        console.log(args);
        const stacks = await kernelsInfoRequest();
        const result = await ProjectDialog.OpenModal(
          {
            name: args.name as string,
            stack: args.stack as string,
            release: args.release as string,
            platform: args.platform as string,
            user_script: args.user_script as string,
            stacks_options: stacks['stacks'],
          },
          false,
          commands
        );
        // console.log("EDIT result");
        // console.log(result);
        // await browserFactory.defaultBrowser.model.cd(result["project_dir"])
        // //await browserFactory.defaultBrowser.model.refresh();
        return result;
      },
    });

    // Add the command to the launcher
    if (launcher) {
      // await manager.ready.then(() => {
      launcher.add({
        command: CommandIDs.project_dialog,
        category: PALETTE_CATEGORY,
        rank: 1,
        kernelIconUrl: '',
      });
      // })
    }

    // Add the command to the palette
    if (palette) {
      palette.addItem({
        command: CommandIDs.project_dialog,
        args: { isPalette: true },
        category: PALETTE_CATEGORY,
      });
    }

    // Add the command to the menu
    //if (menu) {
    //menu.fileMenu.newMenu.addGroup([{ command }], 30);
    //}
    //}
  },
};

export default extension;
