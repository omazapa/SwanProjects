#pip3 install swanprojects --user

#pip3 install  . --user
# Register server extension
jupyter serverextension enable --py swanprojects
# Install dependencies
jlpm
# Build Typescript source
jlpm build
# Link your development version of the extension with JupyterLab
jupyter labextension link .
#cd ~
#jupyter lab --watch
#jupyter lab
#cd -
