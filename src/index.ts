// Copyright (c) SWAN Development Team.
// Author: Omar.Zapata@cern.ch 2021
import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';
import { swanProjectIcon } from './icons';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

const PALETTE_CATEGORY = 'Project';

import { ProjectDialog } from './ProjectDialog';

/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const projectDialog = 'swan:create-project-dialog';
  export const projectDialogEdit = 'swan:edit-project-dialog';
}

import { ILauncher } from '@jupyterlab/launcher';
import { kernelsInfoRequest } from './request';

/**
 * Initialization data for the server-extension-example extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'swanprojects',
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
    console.log('JupyterLab extension swanprojects is activated!');
    const { commands } = app;
    commands.addCommand(CommandIDs.projectDialog, {
      icon: swanProjectIcon,
      label: 'New',
      caption: 'New',
      execute: async args => {
        const stacks = await kernelsInfoRequest();
        ProjectDialog.OpenModal(
          {
            name: '',
            stack: '',
            release: '',
            platform: '',
            user_script: '',
            stacks_options: stacks['stacks']
          },
          true,
          commands
        );
      }
    });

    commands.addCommand(CommandIDs.projectDialogEdit, {
      icon: swanProjectIcon,
      label: 'Edit',
      caption: 'Edit',
      execute: async args => {
        const stacks = await kernelsInfoRequest();
        ProjectDialog.OpenModal(
          {
            name: args.name as string,
            stack: args.stack as string,
            release: args.release as string,
            platform: args.platform as string,
            user_script: args.user_script as string,
            stacks_options: stacks['stacks']
          },
          false,
          commands,
          args.corrupted as boolean
        );
      }
    });

    // Add the command to the launcher
    if (launcher) {
      launcher.add({
        command: CommandIDs.projectDialog,
        category: PALETTE_CATEGORY,
        rank: 1,
        kernelIconUrl: ''
      });
    }

    // // Add the command to the palette
    if (palette) {
      palette.addItem({
        command: CommandIDs.projectDialog,
        args: { isPalette: true },
        category: PALETTE_CATEGORY
      });
    }
  }
};

export default extension;
