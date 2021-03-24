import { classes, LabIcon } from '@jupyterlab/ui-components';
import * as React from 'react';
import ReactTooltip from "react-tooltip";
import {Dialog, InputDialog,Styling} from  '@jupyterlab/apputils'

import { Widget } from '@lumino/widgets';

const INPUT_DIALOG_CLASS = 'jp-Input-Dialog';

/**
 * Base widget for input dialog body
 */
 class InputDialogBase<T> extends Widget implements Dialog.IBodyWidget<T> {
  /**
   * InputDialog constructor
   *
   * @param label Input field label
   */
  constructor(label?: string) {
    super();
    this.addClass(INPUT_DIALOG_CLASS);

    if (label !== undefined) {
      const labelElement = document.createElement('label');
      labelElement.textContent = label;

      // Initialize the node
      this.node.appendChild(labelElement);
    }
  }

  /** Input HTML node */
  protected _input: HTMLInputElement;
}

export class InputItemsDialog extends InputDialogBase<string> {
  /**
   * InputItemsDialog constructor
   *
   * @param options Constructor options
   */
  constructor(options: InputDialog.IItemOptions) {
    super(options.label);

    this._editable = options.editable || false;

    let current = options.current || 0;
    let defaultIndex: number;
    if (typeof current === 'number') {
      defaultIndex = Math.max(0, Math.min(current, options.items.length - 1));
      current = '';
    }

    this._list = document.createElement('select');
    options.items.forEach((item, index) => {
      const option = document.createElement('option');
      if (index === defaultIndex) {
        option.selected = true;
        current = item;
      }
      option.value = item;
      option.textContent = item;
      this._list.appendChild(option);
    });

    if (options.editable) {
      /* Use of list and datalist */
      const data = document.createElement('datalist');
      data.id = 'input-dialog-items';
      data.appendChild(this._list);

      this._input = document.createElement('input', {});
      this._input.classList.add('jp-mod-styled');
      this._input.type = 'list';
      this._input.value = current;
      this._input.setAttribute('list', data.id);
      if (options.placeholder) {
        this._input.placeholder = options.placeholder;
      }
      this.node.appendChild(this._input);
      this.node.appendChild(data);
    } else {
      /* Use select directly */
      this.node.appendChild(Styling.wrapSelect(this._list));
    }
  }

  /**
   * Get the user choice
   */
  getValue(): string {
    if (this._editable) {
      return this._input.value;
    } else {
      return this._list.value;
    }
  }

  private _list: HTMLSelectElement;
  private _editable: boolean;
}



export function HelpTooltip(
  id:string,
  message:string
): React.ReactElement<any> {
  return (
    <div style={{padding: "0px 5px 0px 10px"}}>
    <div style={{borderRadius: "50%", padding: "5px",border:"1px solid",width:"5px",height:"5px",backgroundColor: "#d5d5d5", display:" flex", justifyContent: "center", alignItems: "center"}}>
    <a data-for={id} data-tip={message}>?</a>
    <ReactTooltip id={id} getContent={(dataTip) => `${dataTip}`}/>
    </div>
    </div>
  );
}


/**
 * A pure tsx component for a launcher card.
 *
 * @param kernel - whether the item takes uses a kernel.
 *
 * @param item - the launcher item to render.
 *
 * @param launcher - the Launcher instance to which this is added.
 *
 * @param launcherCallback - a callback to call after an item has been launched.
 *
 * @returns a vdom `VirtualElement` for the launcher card.
 */
 export function Card(
    label: string,
    updateCallback: () => void
  ): React.ReactElement<any> {
    // Get some properties of the command
    const title = "Test";
  
    // Build the onclick handler.
    const onclick = () => {
      // If an item has already been launched,
      // don't try to launch another.
        updateCallback();
    };
  
    // With tabindex working, you can now pick a kernel by tabbing around and
    // pressing Enter.
    const onkeypress = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        onclick();
      }
    };
    const iconClass ="";// commands.iconClass(command, args);
    const icon ="";// _icon === iconClass ? undefined : _icon;
  
    // Return the VDOM element.
    return (
      <div style={{height:"70px",width:"70px"}}
        className="jp-LauncherCard"
        title={title}
        onClick={onclick}
        onKeyPress={onkeypress}
        tabIndex={100}
      >
        <div className="jp-LauncherCard-icon">
          {
              <LabIcon.resolveReact
                icon={icon}
                iconClass={classes(iconClass, 'jp-Icon-cover')}
                stylesheet="launcherCard"
              />
            }
        </div>
        <div className="jp-LauncherCard-label" title={title}>
          <p>{label}</p>
        </div>
      </div>
    );
  }
  
  