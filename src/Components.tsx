import { classes, LabIcon } from '@jupyterlab/ui-components';
import * as React from 'react';

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
      <div
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
  
  