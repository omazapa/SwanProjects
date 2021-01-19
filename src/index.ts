// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
    ILabShell,
    JupyterFrontEnd,
    JupyterFrontEndPlugin
  } from '@jupyterlab/application';
  import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
  import { ILauncher, LauncherModel} from '@jupyterlab/launcher';
  import {  SWANLauncher } from './launcher'
  import { launcherIcon } from '@jupyterlab/ui-components';
  
  import { toArray } from '@lumino/algorithm';
  import { JSONObject } from '@lumino/coreutils';
  import { Widget } from '@lumino/widgets';
  
  import {cernboxIcon,swanProjectImportIcon,swanProjectIcon} from './icons'

  import { InputDialog, Dialog } from '@jupyterlab/apputils';
  import {
    each
  } from '@lumino/algorithm';

  /**
   * The command IDs used by the launcher plugin.
   */
  namespace CommandIDs {
    export const create_launcher = 'launcher:create';
    export const create_project = 'swan:create_project';
    export const import_project = 'swan:import_project';
  }
  
  /**
   * A service providing an interface to the the launcher.
   */
  const ProjectLauncher: JupyterFrontEndPlugin<ILauncher> = {
    activate,
    id: '@swan/launcher-project:plugin',
    requires: [ILabShell],
    optional: [ICommandPalette],
    provides: ILauncher,
    autoStart: true
  };
  
  /**
   * Export the plugin as default.
   */
   export {SWANLauncher};
   export default ProjectLauncher;
  
  /**
   * Creatring request routine to get kernels information
   */
  import { request } from './request';

  export function kernelsInfoRequest():any
  {
    try {
      return request<any>('swan/kernels/info', {
        method: 'GET'
      }).then(rvalue => {
          console.log(rvalue);
          return rvalue;
      });
    } catch (reason) {
      console.error(
        `Error on GET 'swan/kernels/info'.\n${reason}`
      );
    }
  }
  
  export function createProjectRequest(dataToSend:JSONObject):any
  {
  try {
    request<any>('swan/project/create', {
      body: JSON.stringify(dataToSend),
      method: 'POST'
    }).then(pvalue => {
        console.log(pvalue);
    });
  } catch (reason) {
    console.error(
      `Error on POST /swan/project/create ${dataToSend}.\n${reason}`
    );
  }
}

const PALETTE_CATEGORY = 'SWAN';

  /**
   * Activate the launcher.
   */
  function activate(
    app: JupyterFrontEnd,
    labShell: ILabShell,
    palette: ICommandPalette | null
  ): ILauncher {
    const { serviceManager, commands } = app;
    const model = new LauncherModel();
    var launcher = null;
    console.log("SWAN Project/Launcher Activated");
    commands.addCommand(CommandIDs.create_launcher, {
      icon:cernboxIcon,
      label: 'Share',
      execute: (args: JSONObject) => {
        console.dir('CWD = '+JSON.stringify(args))
        const cwd = args['cwd'] ? String(args['cwd']) : '';
        const id = `swan-launcher-${Private.id++}`;
        const callback = (item: Widget) => {
          labShell.add(item, 'main', { ref: id });
        };
  
        launcher = new SWANLauncher({ model, cwd, callback, commands });
        
        launcher.model = model;
        launcher.service_manager = serviceManager;
        launcher.title.icon = launcherIcon;
        launcher.title.label = 'SWAN Launcher';
      
        const main = new MainAreaWidget({ content: launcher });
  
        // If there are any other widgets open, remove the launcher close icon.
        main.title.closable = !!toArray(labShell.widgets('main')).length;
        main.id = id;
  
        labShell.add(main, 'main', { activate: args['activate'] as boolean });
  
        labShell.layoutModified.connect(() => {
          // If there is only a launcher open, remove the close icon.
          main.title.closable = toArray(labShell.widgets('main')).length > 1;
        }, main);
        if (palette) {
          palette.addItem({ command: CommandIDs.create_launcher, category: 'SWAN' });
        }
      
        return main;
      }
    });
  
  //  let command_cernbox:ILauncher.IItemOptions = {
  //    command:'launcher:create',
  //    category:'CERNBox'//,
      //kernelIconUrl:"swan:create-project"
  //  }
  //  model.add(command_cernbox)
  
  commands.addCommand(CommandIDs.create_project, {
    icon:swanProjectIcon,
    label: 'New',
    caption: 'New',
    execute: async args => {

      let result:Dialog.IResult<string> = await  InputDialog.getText(
        {
          title: 'Project Name',
        }
      )
      if (!result.button.accept) return
      const project_name=result.value;

      const kernelsInfo = await kernelsInfoRequest() as JSONObject;
      const sourcerepos = kernelsInfo['kernels'] as JSONObject;
      const sourcerepos_keys = Object.keys(sourcerepos)
        
      console.log("source_repo = "+sourcerepos_keys);
      result = await  InputDialog.getItem({
      title: 'Source Repository',
      items: sourcerepos_keys,
      current: sourcerepos_keys[0]
      })
      if (!result.button.accept) return
      const source_repo=result.value as string;

      const options = sourcerepos[source_repo] as Array<JSONObject>;
      
      let all_stacks:any = [];
      each(options, (item, index) => {            
        all_stacks.push(options[index]['STACKS'])
      })
      all_stacks = all_stacks.flat();

      result = await  InputDialog.getItem({
          title: 'Software stack',
           items: all_stacks,
           current: all_stacks[0]
        })
        if (!result.button.accept) return
        const stack=result.value as string;
        
        let platforms:Array<string> = [];
        let kernels:Array<string> = [];
        each(options, (item, index) => {
        const stacks = options[index]['STACKS'] as Array<string>;
        if(stacks.includes(stack))
        {
          platforms =  options[index]['PLATFORMS'] as Array<string>;
          kernels =  options[index]['KERNELS'] as Array<string>;
        }
      })

      result = await InputDialog.getItem({
            title: 'Platform',
             items: platforms,
             current: platforms[0]
          })
        if (!result.button.accept) return
        const platform=result.value;
            
        result = await InputDialog.getText(
              {
                title: 'Environment script',
              }
            )
        if (!result.button.accept) return
        const userscript=result.value;
        console.log("project_name = "+project_name)
        console.log("source_repo = "+source_repo)
        console.log("stack = "+stack)
        console.log("platform = "+platform)
        console.log("kernels = "+kernels)
        console.log("userscript = "+userscript)
        const dataToSend = { PROJECT_NAME: project_name, SOURCE:source_repo, STACK:stack,PLATFORM:platform, KERNELS:kernels,USER_SCRIPT:userscript};
        await createProjectRequest(dataToSend);
        
        return
    }
  });

    commands.addCommand(CommandIDs.import_project, {
      icon:swanProjectImportIcon,
      label: 'Import',
      execute: (args: JSONObject) => {
        //TODO!
      }
    })
  
    let command_create:ILauncher.IItemOptions = {
      command:'swan:create_project',
      category:'Project',
      rank:1
    }

    let command_import:ILauncher.IItemOptions = {
      command:'swan:import_project',
      category:'Project'
    }
  
    model.add(command_create)
    model.add(command_import)
  
  
    if (palette) {
      palette.addItem({ command: CommandIDs.create_launcher, category: 'Launcher' });
      palette.addItem({ command: CommandIDs.create_project, args: { isPalette: true}, category: PALETTE_CATEGORY});
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
    export let id = 0;
  }
  