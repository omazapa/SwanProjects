# Copyright (c) SWAN Development Team.
# Author: Omar.Zapata@cern.ch 2021

from jupyter_client.kernelspec import KernelSpecManager, NoSuchKernel
from swanprojects.utils import get_project_info, project_path
from traitlets import Unicode
from swanprojects.config import get_kernel_resorces_path

import shutil
import json
import os


class SwanKernelSpecManager(KernelSpecManager):
    path = Unicode("", config=True, allow_none=True,
                   help="SWAN Project path")

    def __init__(self, **kwargs):
        super(SwanKernelSpecManager, self).__init__(**kwargs)
        print("JupyterLab swankernelspecmanager is activated!")
        self.project = None
        self.kernel_dirs = []

    def save_native_spec(self, kernel_dir, python_path, display_name):
        shutil.copytree(get_kernel_resorces_path(), kernel_dir)
        spec = {"argv": [python_path,
                         "-m",
                         "ipykernel_launcher",
                         "-f",
                         "{connection_file}"
                         ],
                "display_name": display_name,
                "language": "python"
                }
        kernel_file = kernel_dir + "/kernel.json"
        f = open(kernel_file, "w+")
        json.dump(spec, f, indent=4)
        f.close()

    def set_path(self, path):
        self.path = path
        self.project = project_path(path)
        if self.project is None:
            self.kernel_dirs = []
        else:
            self.project_info = get_project_info(self.project)
            self.kernel_dirs = self.project_info["kernel_dirs"]
            local_kernels = self.project + "/.local/share/jupyter/kernels/"
            for version in ["2", "3"]:
                python = "python" + version
                if self.project_info[python]["found"] and self.project_info[python]["ipykernel"]:
                    kerne_dir = local_kernels + python
                    if not os.path.exists(kerne_dir):
                        self.save_native_spec(
                            kerne_dir, self.project_info[python]["path"], "Python " + version)
            self.kernel_dirs.append(local_kernels)
            print("KERNEL DIRS = ", self.kernel_dirs)

    def wrap_kernel_specs(self, project_info, kspec):
        stack = project_info["stack"]
        release = project_info["release"]
        platform = project_info["platform"]
        user_script = project_info["user_script"]

        argv = [
            "/bin/bash",
            "swan_env",
            stack,
            release,
            platform,
            user_script,
            "."]

        kspec.argv = argv + kspec.argv
        return kspec

    def find_kernel_specs(self, skip_base=True):
        """ Returns a dict mapping kernel names to resource directories.
            The update process also adds the resource dir for the SWAN
            environments.
        """
        kspecs = super(SwanKernelSpecManager, self).find_kernel_specs()
        return kspecs

    def get_kernel_spec(self, kernel_name):
        """ Returns a :class:`KernelSpec` instance for the given kernel_name.
            Additionally, SWAN kernelspecs are generated on the fly
            accordingly with the detected envitonments.
        """
        kspec = super(SwanKernelSpecManager, self).get_kernel_spec(kernel_name)
        if self.project is None:
            return kspec
        else:
            kspec = self.wrap_kernel_specs(self.project_info, kspec)
            print("-" * 10)
            print("ON get_kernel_spec = ", kspec.argv)
            print("-" * 10)

        return kspec

    def get_all_specs(self):
        """ Returns a dict mapping kernel names to dictionaries with two
            entries: "resource_dir" and "spec". This was added to fill out
            the full public interface to KernelManagerSpec.
        """
        res = {}
        for name, resource_dir in self.find_kernel_specs().items():
            try:
                spec = self.get_kernel_spec(name)
                res[name] = {'resource_dir': resource_dir,
                             'spec': spec.to_dict()}
            except NoSuchKernel:
                self.log.warning(
                    "Error loading kernelspec %r", name, exc_info=True)
        return res
