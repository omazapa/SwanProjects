#pip3 install . --user --upgrade

#pip3 install  . --user
# Register server extension
jupyter serverextension enable --py swanprojects
# Install dependencies
jlpm clean
jlpm
# Build Typescript source
jlpm build
# Link your development version of the extension with JupyterLab
jupyter labextension link .
cd ~
#jupyter lab --watch
jupyter lab
cd -
