import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';



type ModalProps = {
  handleClose: any,
  children: any,
  show:boolean
}



const Modal = ({children,handleClose,show}:ModalProps): JSX.Element =>{
    //const [] = useState(0);
    const showHideClassName = show ? "modal display-block" : "modal display-none";
  
    return (
      <div className={showHideClassName}>
        <section className="modal-main">
          {children}
          <button onClick={handleClose}>close</button>
        </section>
      </div>
    );
  };


/**
 * A Counter Lumino Widget that wraps a CounterComponent.
 */
export class CreateProject extends ReactWidget {
  /**
   * Constructs a new CounterWidget.
   */
  constructor() {
    super();
    this.addClass('jp-ReactWidget');
  }
  
  launch(){
    this.enable = true;
  }  

  render(): JSX.Element {

    return <Modal children="" handleClose="" show={true}/>;
  }
  protected enable: boolean;
}

