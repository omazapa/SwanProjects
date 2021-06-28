import { classes, LabIcon } from '@jupyterlab/ui-components';
import * as React from 'react';
import ReactTooltip from 'react-tooltip';

/**
 * @param id Id for the html element
 * @param message Message to display in the tooltip
 * @returns React Element
 */
export function HelpTooltip(
  id: string,
  message: string
): React.ReactElement<any> {
  return (
    <div className="sw-Component-tooltip">
      <div
        style={{
          borderRadius: '50%',
          padding: '5px',
          width: '6px',
          height: '6px',
          backgroundColor: '#d5d5d5',
          display: ' flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <a data-for={id} data-tip={message}>
          ?
        </a>
        <ReactTooltip
          html={true}
          id={id}
          multiline={true}
          getContent={(dataTip): string => `${dataTip}`}
        />
      </div>
    </div>
  );
}

/**
 * A pure tsx component for a launcher card.
 *
 * @param label - Text for the Card
 * @param icon - Icon for the Card
 * @param updateCallback - Callback to update stacks on other components
 * @returns a vdom `VirtualElement` for the launcher card.
 */
export function Card(
  label: string,
  icon: LabIcon,
  updateCallback: (stack: string) => void
): React.ReactElement<any> {
  // Get some properties of the command
  const title = label;
  // Build the onclick handler.
  const onclick = (): void => {
    // If an item has already been launched,
    // don't try to launch another.
    updateCallback(label);
  };

  // With tabindex working, you can now pick a kernel by tabbing around and
  // pressing Enter.
  const onkeypress = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      onclick();
    }
  };
  // Return the VDOM element.
  return (
    <div
      style={{ height: '75px', width: '75px' }}
      className="jp-LauncherCard"
      id={label}
      title={title}
      onClick={onclick}
      onKeyPress={onkeypress}
      tabIndex={100}
    >
      <div className="jp-LauncherCard-icon" style={{ paddingTop: '4px' }}>
        {
          <LabIcon.resolveReact
            icon={icon}
            iconClass={classes('', 'jp-Icon-cover')}
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
