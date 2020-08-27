pip3 install jupyterlab_swan --user

pip3 install  . --user
# Register server extension
jupyter serverextension enable --py jupyterlab_swan
# Install dependencies
jlpm
# Build Typescript source
jlpm build
# Link your development version of the extension with JupyterLab
jupyter labextension link .
jupyter lab --watch
