// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  ILabShell,
  LabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
import { ILauncher, LauncherModel, Launcher } from '@jupyterlab/launcher';
import { launcherIcon } from '@jupyterlab/ui-components';

import { toArray } from '@lumino/algorithm';
//import { JSONObject } from '@lumino/coreutils';
import { Widget } from '@lumino/widgets';
/**
 * The command IDs used by the launcher plugin.
 */
namespace CommandIDs {
  export const create = 'swan_launcher:create';
}

/**
 * A service providing an interface to the the launcher.
 */
const ProjectLauncher: JupyterFrontEndPlugin<ILauncher> = {
  activate,
  id: '@jupyterlab/launcher-extension:ProjectLauncher',
  requires: [ILabShell],
  optional: [ICommandPalette],
  provides: ILauncher,
  autoStart: true
};

/**
 * Export the plugin as default.
 */
export default ProjectLauncher;

/**
 * Activate the launcher.
 */
function activate(
  app: JupyterFrontEnd,
  labShell: ILabShell,
  palette: ICommandPalette | null
): ILauncher {
  const { commands } = app;
  const model = new LauncherModel();

  commands.addCommand(CommandIDs.create, {
    label: 'Open SWAN Project Launcher',
    execute: args => {
      console.log(args)
      const labShell  = new LabShell() 

      const cwd = args['cwd'] ? String(args['cwd']) : '';
      const id = `launcher-${Private.id++}`;
      const callback = (item: Widget) => {
        labShell.add(item, 'main', { ref: id });
      };
      const launcher = new Launcher({ model, cwd, callback, commands });

      launcher.model = model;
      launcher.title.icon = launcherIcon;
      launcher.title.label = 'SWAN Project';

      const main = new MainAreaWidget({ content: launcher });

      // If there are any other widgets open, remove the launcher close icon.
      main.title.closable = !!toArray(labShell.widgets('main')).length;
      main.id = id;

      labShell.add(main, 'main', { activate: args['activate'] as boolean });

      labShell.layoutModified.connect(() => {
        // If there is only a launcher open, remove the close icon.
        main.title.closable = toArray(labShell.widgets('main')).length > 1;
      }, main);

      return main;
    }
  });

  if (palette) {
    palette.addItem({ command: CommandIDs.create, category: 'SWAN Project' });
  }

  return model;
}

/**
 * The namespace for module private data.
 */
namespace Private {
  /**
   * The incrementing id used for launcher widgets.
   */
  export let id = 1;
}
