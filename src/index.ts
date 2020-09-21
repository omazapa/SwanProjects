import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { MainAreaWidget,ICommandPalette} from '@jupyterlab/apputils';
//import { PageConfig } from '@jupyterlab/coreutils';


import { requestAPI } from './jlabextexample';


//import { LabIcon } from '@jupyterlab/ui-components';
import {swanProjectIcon,cmsIcon} from './icons'

import { InputDialog } from '@jupyterlab/apputils';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

//import ProjectLauncher from './launcher'

const PALETTE_CATEGORY = 'Project';

import {ProjectWidget} from './ProjectWidget'

import {CreateProject} from './CreateProject'

/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const get_cmssw = 'swan:create-project';
  export const open_project = 'swan_launcher:create';
  export const create_project = 'swan:create-project-new';
  
}

import { ILauncher} from '@jupyterlab/launcher';
//import { launcherIcon } from '@jupyterlab/ui-components';

//import { toArray } from '@lumino/algorithm';
//import { JSONObject } from '@lumino/coreutils';
//import { Widget } from '@lumino/widgets';

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
    project: CreateProject,
    browserFactory: IFileBrowserFactory
  ) => {
    console.log('JupyterLab extension SWAN is activated!');
    const manager = app.serviceManager;
    //let cmsIconStr = '../style/CMS_logo.svg';
    //ProjectLauncher.activate(app)


    //const { commands } = app;
    const { commands, shell } = app;
    //const category = 'SWAN';

    const scram_options = ['slc7_amd64_gcc820','slc7_amd64_gcc700','slc7_amd64_gcc630'];
    let scram_option = scram_options[0];

    let cmssw_options = ['Not Options Found'];
    let cmssw_option = cmssw_options[0];

    const cmssw_command = CommandIDs.get_cmssw;
/*    const cmsicon = new LabIcon({
      name: 'launcher:cmssw-icon',
      svgstr: cmsIconStr
    });
    commands.addCommand(CommandIDs.create_project, {
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
    commands.addCommand(cmssw_command, {
      icon:swanProjectIcon,
      label: 'New',
      caption: 'New',
      execute: async args => {
        return InputDialog.getText(
          {
            title: 'Project Name',
          }
        ).then(project_name => { 
          if (project_name ==null) return
        InputDialog.getItem({
          title: 'Pick an SCRAM Version',
          items: scram_options,
          current: Math.max(0, scram_options.indexOf(scram_option))
        }).then(value => {
          if(value==null) return
          console.log('selected item ' + value.value);
          if (value.value === 'slc7_amd64_gcc820')
          {
            cmssw_options=["CMSSW_11_0_0","CMSSW_10_6_0","CMSSW_10_5_0","CMSSW_10_4_0"]            
          }

          if(value.value === 'slc7_amd64_gcc700')
          {
            cmssw_options=["CMSSW_10_6_0","CMSSW_10_5_0","CMSSW_10_4_0","CMSSW_10_3_0","CMSSW_10_2_0","CMSSW_10_1_0","CMSSW_10_0_0"]
          }
          if(value.value === 'slc7_amd64_gcc630')
          {
            cmssw_options=["CMSSW_10_2_0","CMSSW_10_1_0","CMSSW_10_0_0","CMSSW_9_4_0","CMSSW_9_3_0","CMSSW_9_2_0","CMSSW_9_1_0","CMSSW_9_0_0"]
          }
          InputDialog.getItem({
            title: 'Pick an CMSSW Version',
            items: cmssw_options,
            current: Math.max(0, cmssw_options.indexOf(cmssw_option))
          }).then(cmssw_value => {

            if(cmssw_value==null) return
            // POST request
            const dataToSend = { SCRAM: value.value, CMSSW:cmssw_value.value, PROJECT_NAME:project_name.value };
            try {
              requestAPI<any>('create', {
                body: JSON.stringify(dataToSend),
                method: 'POST'
              }).then(pvalue => {
                  console.log(pvalue);
              });
            } catch (reason) {
              console.error(
                `Error on POST /swan/create ${dataToSend}.\n${reason}`
              );
            }
            const cwd =
            (args['cwd'] as string) ||
            (browserFactory ? browserFactory.defaultBrowser.model.path : '');
            let content: ProjectWidget;
            content = new ProjectWidget(app,cwd);
            content.title.label = project_name.value;
            content.title.caption = project_name.value;
            console.log(content)
            const command_project ='swan_project_'+project_name.value
            ///actions to execute witih the env HERE!
            console.log('selected item ' + value.value);
            console.log(MainAreaWidget)
            commands.addCommand(command_project, {
              icon:cmsIcon,
              label: project_name.value,
              caption: project_name.value,
              execute: () => {
                const widget = new MainAreaWidget({ content });
                shell.add(widget, 'main');
              }
            });
            
            //palette.addItem({ command:command_project, category: 'Project' });
            
            if (launcher) {
              // Add launcher
              launcher.add({
                command: command_project,
                category: "Projects"
              });
            }        
            
          });
        });
      });
      }
    });
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
          command: cmssw_command,
          category: PALETTE_CATEGORY,
          rank: 1,
          kernelIconUrl: ""
        });
      })
    }

    // Add the command to the palette
    if (palette) {
      palette.addItem({
        command: cmssw_command,
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