from jupyter_client.kernelspec import KernelSpecManager, KernelSpec, NoSuchKernel
from jupyter_core.paths import jupyter_data_dir, jupyter_path
from traitlets import Unicode, Bool
from swanprojects.utils import get_project_info, has_project_file
import subprocess
import sys
import os

class SwanKernelSpecManager(KernelSpecManager):
    project_path = Unicode("", config=True, allow_none=True,
                         help="SWAN Project path")
    home_kernels = Bool(False, config=True, allow_none=False,
                         help="SWAN Project home kernels")
    def __init__(self, **kwargs):
        super(SwanKernelSpecManager, self).__init__(**kwargs)
        print("JupyterLab server extension SWAN Projects - KernelSpecManager is activated!")
        self.kernels_blacklist_paths = [os.environ["HOME"]+os.sep+'.local/share/jupyter/kernels','/usr/local/share/jupyter/kernels','/usr/share/jupyter/kernels']

    def set_project_path(self,project_path):
        self.project_path = project_path

    def set_home_kernels(self,home_kernels):
        self.home_kernels = home_kernels

    def set_project_kernel_path(self):
        self.kernel_dirs = self.get_env_kernel_paths()

    def wrap_kernel_specs(self,project_info,kspec):
        repo = project_info["source"]
        stack = project_info["stack"]
        platform = project_info["platform"]
        user_script = project_info["user_script"]

        argv = ["/bin/bash","swan_env",repo,stack,platform,user_script, "."]

        kspec.argv = argv + kspec.argv
        return kspec 

    def _get_kernels_default_paths(self):
        tmp_paths = jupyter_path('kernels')
        paths = []
        for path in tmp_paths:
            found=False
            for bl_path in self.kernels_blacklist_paths:
                if bl_path in path:
                    found=True
            if not found:
                paths.append(path)
        return paths

    def get_env_kernel_paths(self):
        if self.project_path is None:
            return self._get_kernels_default_paths()
        project_info = get_project_info(self.project_path)
        if project_info == None:
            return self._get_kernels_default_paths()
        else:
            if not has_project_file(self.project_path):
                print({'error':'Error, not valid project path, .swanfile not found.','project_path':self.project_path})
                return {}

            command =  ["swan_kmspecs","--project_path",self.project_path,"--jupyter_kernel_paths"]
            if self.home_kernels:
                command.append("--home_kernels")
            env=os.environ
            env["SWAN_ENV_SILENCE"] = "1"
            proc = subprocess.Popen(command, stdout = subprocess.PIPE, env=env)
            proc.wait()
            data = proc.stdout.read().decode("utf-8")
            proc.communicate()
            data="".join(data).replace('\n','')
            data=eval(data)
            print("KERNEL PATHS----")
            print(data)
            print("---------------")
            return data


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
        if self.project_path is None:
            return kspec
        project_info = get_project_info(self.project_path)
        if project_info is not None:
            kspec = self.wrap_kernel_specs(project_info,kspec)
            print("-"*10)
            print("ON get_kernel_spec = ",kspec.argv)
            print("-"*10)
            
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
                self.log.warning("Error loading kernelspec %r", name, exc_info=True)
        print("ALL SPECS",res)
        return res
