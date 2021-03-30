import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

//import { MainAreaWidget,ICommandPalette} from '@jupyterlab/apputils';
import {ICommandPalette} from '@jupyterlab/apputils';
//import { PageConfig } from '@jupyterlab/coreutils';


//import { requestAPI } from './jlabextexample';


//import { LabIcon } from '@jupyterlab/ui-components';
//import {swanProjectIcon,cmsIcon} from './icons'
import {swanProjectIcon} from './icons'

//import { InputDialog, Dialog } from '@jupyterlab/apputils';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';


//import ProjectLauncher from './launcher'

const PALETTE_CATEGORY = 'Project';

//import {ProjectWidget} from './ProjectWidget'

import {ProjectDialog} from './ProjectDialog'
/*import { JSONObject} from '@lumino/coreutils';
import {
  each
} from '@lumino/algorithm';
*/
/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const project_dialog = 'swan:create-project';
  export const open_project = 'swan_launcher:create';
  export const create_project = 'swan:create-project-new';
  
}

import { ILauncher} from '@jupyterlab/launcher';
//import { launcherIcon } from '@jupyterlab/ui-components';

//import { toArray } from '@lumino/algorithm';
//import { JSONObject } from '@lumino/coreutils';
//import { Widget } from '@lumino/widgets';
import { request } from './request';

export {request};

export function kernelsInfoRequest():any
{
  try {
    return request<any>('swan/stacks/info', {
      method: 'GET'
    }).then(rvalue => {
        console.log(rvalue);
        return rvalue;
    });
  } catch (reason) {
    console.error(
      `Error on GET 'swan/stacks/info'.\n${reason}`
    );
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
    console.log('JupyterLab extension SWAN is activated!');
    const manager = app.serviceManager;
    //const { commands, shell } = app;
    const { commands } = app;    

  
    //const project_dialog_command = CommandIDs.project_dialog;
/*
    commands.addCommand(CommandIDs.project_dialog, {
      label: args => (args['isPalette'] ? 'New Project' : 'New Project'),
      caption: 'New Project',
      icon: args => (args['isPalette'] ? null : cmsicon),
      execute: async args => {
        project =new CreateProject();
        project.launch()
        project.render()
      }
    });
*/

      commands.addCommand(CommandIDs.project_dialog, {
      icon:swanProjectIcon,
      label: 'New',
      caption: 'New',
      execute: async args => {
        var stacks = await kernelsInfoRequest();
        ProjectDialog.OpenModal({project_name:"",project_source:"",project_stack:"",project_platform:"",project_user_script:"",stacks_options:stacks["stacks"]},true);
      //   .then(()  => {
      //     console.log("called Create Project")
      // })
      }
    }) 

/*    commands.addCommand(CommandIDs.project_dialog, {
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
        const source_repo=result.value;

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
          const stack=result.value;
          
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
          
          return
      }
    });*/
/*
    // Add the command to the launcher
    if (launcher) {
      void manager.ready.then(() => {
        launcher.add({
          command: CommandIDs.open_project,
          category: PALETTE_CATEGORY,
          rank: 1,
          kernelIconUrl: ""
        });
      })
    }

    // Add the command to the launcher
    if (launcher) {
      void manager.ready.then(() => {
        launcher.add({
          command: CommandIDs.create_project,
          category: PALETTE_CATEGORY,
          rank: 0,
          kernelIconUrl: ""
        });
      })
    }
*/

    // Add the command to the launcher
    if (launcher) {
      void manager.ready.then(() => {
        launcher.add({
          command: CommandIDs.project_dialog,
          category: PALETTE_CATEGORY,
          rank: 1,
          kernelIconUrl: ""
        });
      })
    }

    // Add the command to the palette
    if (palette) {
      palette.addItem({
        command: CommandIDs.project_dialog,
        args: { isPalette: true},
        category: PALETTE_CATEGORY
      });
    }

    // Add the command to the menu
    //if (menu) {
      //menu.fileMenu.newMenu.addGroup([{ command }], 30);
    //}
    //}


  }
};


export default extension;