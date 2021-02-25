from jupyter_client.kernelspec import KernelSpecManager, KernelSpec, NoSuchKernel
from jupyter_core.paths import jupyter_data_dir
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

    @staticmethod
    def set_project_path(project_path):
        SwanKernelSpecManager.project_path = project_path

    @staticmethod
    def set_home_kernels(home_kernels):
        SwanKernelSpecManager.home_kernels = home_kernels

    def wrap_kernels_specs(self,project_info,kspecs):
        repo = project_info["source"]
        stack = project_info["stack"]
        platform = project_info["platform"]
        user_script = project_info["user_script"]

        home_data_dir=jupyter_data_dir()
        argv = ["/bin/bash","swan_env",repo,stack,platform,user_script, "."]

        stack_kspecs={}
        for spec in kspecs:
            kspecs[spec]['spec']['argv'] = argv + kspecs[spec]['spec']['argv']
            if self.home_kernels:
                stack_kspecs[spec]=kspecs[spec]
            else:
                if not home_data_dir in kspecs[spec]['resource_dir']:
                    stack_kspecs[spec]=kspecs[spec]
        return stack_kspecs


    def get_env_kernels(self):
        if self.project_path is None:
            return self._get_all_specs()
        project_info = get_project_info(self.project_path)
        if project_info == None:
            return self._get_all_specs()
        else:
            if not has_project_file(self.project_path):
                print({'error':'Error, not valid project path, .swanfile not found.','project_path':self.project_path})
                return {}

            command =  ["swan_kmspecs","--project_path",self.project_path]
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
            data = self.wrap_kernels_specs(project_info,data)
            return data
        
    def find_kernel_specs(self, skip_base=True):
        """ Returns a dict mapping kernel names to resource directories.
            The update process also adds the resource dir for the conda
            environments.
        """
        kspecs = super(SwanKernelSpecManager, self).find_kernel_specs()
        print("ON find_kernel_specs = ",kspecs)
        return kspecs

    def get_kernel_spec(self, kernel_name):
        """ Returns a :class:`KernelSpec` instance for the given kernel_name.
            Additionally, conda kernelspecs are generated on the fly
            accordingly with the detected envitonments.
        """
        kspec = super(SwanKernelSpecManager, self).get_kernel_spec(kernel_name)
        print("ON get_kernel_spec = ",kspec)

        return kspec

    def _get_all_specs(self):
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
        return res

    def get_all_specs(self):
        kspecs = self.get_env_kernels()
        home_data_dir=jupyter_data_dir()
        
        stack_kspecs={}
        for spec in kspecs:
            if self.home_kernels:
                stack_kspecs[spec]=kspecs[spec]
            else:
                if not home_data_dir in kspecs[spec]['resource_dir']:
                    stack_kspecs[spec]=kspecs[spec]
        return stack_kspecs
