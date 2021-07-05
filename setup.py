"""
swanprojects setup
"""
import json
from pathlib import Path
from jupyter_packaging import (
    create_cmdclass,
    install_npm,
    ensure_targets,
    combine_commands,
    skip_if_exists,
    get_data_files
)

import setuptools

HERE = Path(__file__).parent.resolve()

# The name of the project
name = "swanprojects"

lab_path = (HERE / name.replace("-", "_") / "labextension")

# Representative files that should exist after a successful build
ensured_targets = [
    str(lab_path / "package.json"),
    str(lab_path / "static/style.js")
]

package_data_spec = {name: ["*"]}

labext_name = "@swan/swanprojects"

data_files_spec = [
    ("share/jupyter/labextensions/%s" % labext_name, str(lab_path), "**"),
    ("share/jupyter/labextensions/%s" %
     labext_name, str(HERE), "install.json"),
    ("etc/jupyter/jupyter_server_config.d",
     "jupyter-config/server-config", "swanprojects.json"),
    # For backward compatibility with notebook server
    ("etc/jupyter/jupyter_notebook_config.d",
     "jupyter-config/nb-config", "swanprojects.json"),
]

long_description = (HERE / "README.md").read_text()

cmdclass = create_cmdclass(
    "jsdeps", package_data_spec=package_data_spec, data_files_spec=data_files_spec
)
js_command = combine_commands(
    install_npm(HERE, build_cmd="build:prod", npm=["jlpm"]),
    ensure_targets(ensured_targets),
)
is_repo = (HERE / ".git").exists()
if is_repo:
    cmdclass["jsdeps"] = js_command
else:
    cmdclass["jsdeps"] = skip_if_exists(ensured_targets, js_command)

# Get the package info from package.json
pkg_json = json.loads((HERE / "package.json").read_bytes())

setup_args = dict(
    name=name,
    version=pkg_json["version"],
    url=pkg_json["homepage"],
    author=pkg_json["author"],
    description=pkg_json["description"],
    license=pkg_json["license"],
    long_description=long_description,
    long_description_content_type="text/markdown",
    scripts=['bin/swan_env', 'bin/swan_bash', 'bin/swan_kmspecs'],
    cmdclass=cmdclass,
    data_files=get_data_files(data_files_spec),
    packages=setuptools.find_packages(),
    install_requires=[
        "jupyter_server>=1.6,<2"
    ],
    zip_safe=False,
    include_package_data=True,
    python_requires=">=3.6",
    platforms="Linux, Mac OS X, Windows",
    keywords=["Jupyter", "JupyterLab", "JupyterLab3"],
    classifiers=[
        "License :: OSI Approved :: GNU Affero General Public License v3",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Framework :: Jupyter",
    ],
)


if __name__ == "__main__":
    setuptools.setup(**setup_args)
