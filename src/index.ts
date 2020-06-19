import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ICommandPalette, IFrame } from '@jupyterlab/apputils';

import { PageConfig } from '@jupyterlab/coreutils';

import { ILauncher } from '@jupyterlab/launcher';

import { requestAPI } from './jlabextexample';


import { LabIcon } from '@jupyterlab/ui-components';


import { InputDialog } from '@jupyterlab/apputils';


const PALETTE_CATEGORY = 'SWAN';

/**
 * The command IDs used by the server extension plugin.
 */
namespace CommandIDs {
  export const get = 'server:get-file';
  export const get_cmssw = 'server:create_env';
}


class IFrameWidget extends IFrame {
  constructor() {
    super();
    const baseUrl = PageConfig.getBaseUrl();
    this.url = baseUrl + 'swan/static/index.html';
    this.id = 'doc-example';
    this.title.label = 'SWAN Server Doc';
    this.title.closable = true;
    this.node.style.overflowY = 'auto';
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
    launcher: ILauncher | null
  ) => {
    console.log('JupyterLab extension SWAN is activated!');
    const manager = app.serviceManager;
    let cmsIconStr = '../style/CMS_logo.svg';
    // GET request
/*    try {
      const data = await requestAPI<any>('hello');
      console.log(data);
    } catch (reason) {
      console.error(`Error on GET /swan/hello.\n${reason}`);
    }
*/

    const { commands, shell } = app;
    const command = CommandIDs.get;
    const category = 'SWAN';

    commands.addCommand(command, {
      label: 'SWAN Docs',
      caption: 'Testing IFrame Widget',
      execute: () => {
        const widget = new IFrameWidget();
        shell.add(widget, 'main');
      }
    });

    palette.addItem({ command, category: category });

    if (launcher) {
      // Add launcher
      launcher.add({
        command: command,
        category: category
      });
    }

    const scram_options = ['slc7_amd64_gcc820','slc7_amd64_gcc700','slc7_amd64_gcc630'];
    let scram_option = scram_options[0];

    let cmssw_options = ['Not Options Found'];
    let cmssw_option = cmssw_options[0];

    const cmssw_command = CommandIDs.get_cmssw;
    const cmsicon = new LabIcon({
      name: 'launcher:cmssw-icon',
      svgstr: cmsIconStr
    });


    commands.addCommand(cmssw_command, {
      label: args => (args['isPalette'] ? 'New CMSSW Env' : 'CMSSW Env'),
      caption: 'Create a new CMSSW Env',
      icon: args => (args['isPalette'] ? null : cmsicon),
      execute: async args => {
        return InputDialog.getItem({
          title: 'Pick an SCRAM Version',
          items: scram_options,
          current: Math.max(0, scram_options.indexOf(scram_option))
        }).then(value => {
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

            // POST request
            const dataToSend = { name: value.value+' '+cmssw_value.value  };
            try {
              requestAPI<any>('hello', {
                body: JSON.stringify(dataToSend),
                method: 'POST'
              }).then(pvalue => {
                  console.log(pvalue);
              });
            } catch (reason) {
              console.error(
                `Error on POST /swan/hello ${dataToSend}.\n${reason}`
              );
            }
            ///actions to execute witih the env HERE!
            console.log('selected item ' + value.value);
          });
        });

      }
    });


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