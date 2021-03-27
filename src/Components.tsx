import { classes, LabIcon } from '@jupyterlab/ui-components';
import * as React from 'react';
import ReactTooltip from "react-tooltip";

export function HelpTooltip(
  id:string,
  message:string
): React.ReactElement<any> {
  return (
    <div style={{padding: "0px 5px 0px 10px"}}>
    <div style={{borderRadius: "50%", padding: "5px",border:"1px solid",width:"5px",height:"5px",backgroundColor: "#d5d5d5", display:" flex", justifyContent: "center", alignItems: "center"}}>
    <a data-for={id} data-tip={message}>?</a>
    <ReactTooltip  html={true} id={id} multiline={true} getContent={(dataTip) => `${dataTip}`}/>
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
    icon:LabIcon,
    updateCallback: (stack:string) => void
  ): React.ReactElement<any> {
    // Get some properties of the command
    const title = label;
    // Build the onclick handler.
    const onclick = () => {
      // If an item has already been launched,
      // don't try to launch another.
        updateCallback(label);
    };
  
    // With tabindex working, you can now pick a kernel by tabbing around and
    // pressing Enter.
    const onkeypress = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        onclick();
      }
    };
    // Return the VDOM element.
    return (
      <div style={{height:"75px",width:"75px"}}
        className="jp-LauncherCard"
        id={label}
        title={title}
        onClick={onclick}
        onKeyPress={onkeypress}
        tabIndex={100}
      >
        <div className="jp-LauncherCard-icon" style={{paddingTop:"4px"}}>
          {
              <LabIcon.resolveReact
                icon={icon}
                iconClass={classes("", 'jp-Icon-cover')}
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
  
  