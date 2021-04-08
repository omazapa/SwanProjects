# SwanProjects

Server and Lab extension that provides:
* In the backend, the endpoints to:
  * Create and edit projects
  * Get project information
  * Get software stack information
  * Customized Kernel Spec Manager  to handle kernel metadata.
* In the Lab extension:
  * React dialogs with a set of components that allows to create and edit projects
  * LabIcons required for the dialogs

## Requirements

JupyterLab~=2 and SwanContents

## Install

Install the package and the nbextension:

```bash
pip install swanprojects
jupyter nbextension install --user --py swanprojects
jupyter labextension install swanprojects
jupyter labextension enable  swanprojects
jupyter lab build
```


To replace the default Jupyter Contents Manager and Kernel Spec Manager in the JupyterLab Notebook configuration (i.e in `jupyter_notebook_config.py`), set the following:

```python
c.NotebookApp.default_url = 'lab'
c.NotebookApp.contents_manager_class = 'swancontents.filemanager.swanfilemanager.SwanFileManager'
c.NotebookApp.kernel_spec_manager_class = 'swanprojects.kernelmanager.kernelspecmanager.SwanKernelSpecManager'
c.KernelSpecManager.ensure_native_kernel = False
```

