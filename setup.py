"""
Setup Module to setup Python Handlers for the jlab_ext_example extension.
"""
import os
from os.path import join as pjoin

from jupyter_packaging import (
    create_cmdclass, install_npm, ensure_targets,
    combine_commands, ensure_python, get_version    
)
import setuptools

HERE = os.path.abspath(os.path.dirname(__file__))

# The name of the project
name="jupyterlab_swan"

# Ensure a valid python version
ensure_python(">=3.5")

# Get the version
version = get_version(pjoin(name, "_version.py"))

lab_path = pjoin(HERE, name, "jupyterlab_swan")

# Representative files that should exist after a successful build
jstargets = [
    pjoin(HERE, "lib", "jlabextexample.js"),
]

package_data_spec = {
    name: [
        "*"
    ]
}

data_files_spec = [
    ("share/jupyter/lab/extensions", lab_path, "*.tgz"),
    ("etc/jupyter/jupyter_notebook_config.d",
     "jupyter-config", "jupyterlab_swan.json"),
]

cmdclass = create_cmdclass("jsdeps",
    package_data_spec=package_data_spec,
    data_files_spec=data_files_spec
)

cmdclass["jsdeps"] = combine_commands(
    install_npm(HERE, build_cmd="build:all", npm=["jlpm"]),
    ensure_targets(jstargets),
)

with open("README.md", "r") as fh:
    long_description = fh.read()

setup_args = dict(
    name=name,
    version=version,
    url="https://github.com/omazapa/jupyter_swan",
    author="Omar Zapata",
    description="CERN SWAN JupyterLab extension with backend and frontend parts.",
    long_description= long_description,
    long_description_content_type="text/markdown",
    scripts=['bin/swan_env','bin/swan_bash','bin/swan_kmspecs'],
    cmdclass= cmdclass,
    packages=setuptools.find_packages(),
    install_requires=[
        "jupyterlab~=2.0",
    ],
    zip_safe=False,
    include_package_data=True,
    license="BSD-3-Clause",
    platforms="Linux, Mac OS X, Windows",
    keywords=["Jupyter", "JupyterLab"],
    classifiers=[
        "License :: OSI Approved :: BSD License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Framework :: Jupyter",
    ],
    entry_points = {
    'jupyter_client.kernel_providers' : [
        # The name before the '=' should match the id attribute
        'swan = jupyterlab_swan:SwanKernelProvider',
    ]},
)


if __name__ == '__main__':
    setuptools.setup(**setup_args)
