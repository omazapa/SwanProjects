#rm -rf tsconfig.tsbuildinfo lib
#pip3 install . --user --upgrade

#pip3 install  . --user
# Register server extension
jupyter serverextension enable --py swanprojects
# Install dependencies
jlpm clean
jlpm
# Build Typescript source
jlpm build
#jupyter lab build
# Link your development version of the extension with JupyterLab
jupyter labextension link .
jupyter lab build
cd ~
#jupyter lab --watch
jupyter lab
cd -
