from jupyter_client.kernelspec import KernelSpecManager, KernelSpec, NoSuchKernel
from jupyter_core.paths import jupyter_data_dir
from traitlets import Unicode, Bool
from swanprojects.utils import get_project_info, has_project_file
import subprocess
import sys
import os

class SwanKernelSpecManager(KernelSpecManager):
    project_path = Unicode("", config=True, allow_none=False,
                         help="SWAN Project path")
    def __init__(self, **kwargs):
        super(SwanKernelSpecManager, self).__init__(**kwargs)
        print("JupyterLab server extension SWAN Projects - KernelSpecManager is activated!")

    @staticmethod
    def set_project_path(project_path):
        SwanKernelSpecManager.project_path = project_path


    def get_env_kernels(self,project_path,home_kernels):
        project_info = get_project_info(self.set_project_path)
        if project_info == None:
            return self._get_all_specs(home_kernels)
        else:
            if not has_project_file(project_path):
                print({'error':'Error, not valid project path, .swanfile not found.','project_path':project_path})
                sys.exit(1)

            command =  ["swan_kmspecs",project_info['source'],project_info['stack'],project_info['platform'],project_info['user_script'], ".","python swan_kmspecs"]
            if home_kernels:
                command.append("--home_kernels")
            env=os.environ
            env["SWAN_ENV_SILENCE"] = "1"
            proc = subprocess.Popen(command, stdout = subprocess.PIPE, env=env)
            proc.wait()
            data = proc.stdout.read().decode("utf-8")
            proc.communicate()
            data="".join(data).replace('\n','')
            data=eval(data)
            return data

    def set_project_kernel_path(self):
        if self.project_path is not None:
            self.kernel_dirs = [self.project_path+"/.local/kernels"]
        
    def find_kernel_specs(self, skip_base=True):
        """ Returns a dict mapping kernel names to resource directories.
            The update process also adds the resource dir for the conda
            environments.
        """
        self.set_project_kernel_path()
        kspecs = super(SwanKernelSpecManager, self).find_kernel_specs()
        return kspecs

    def get_kernel_spec(self, kernel_name):
        """ Returns a :class:`KernelSpec` instance for the given kernel_name.
            Additionally, conda kernelspecs are generated on the fly
            accordingly with the detected envitonments.
        """

        self.set_project_kernel_path()
        return super(SwanKernelSpecManager, self).get_kernel_spec(kernel_name)

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
        return res

    def _get_all_specs(self,home_kernels):
        kspecs = self.get_all_specs()
        home_data_dir=jupyter_data_dir()
        stack_kspecs={}
        for spec in kspecs:
            if home_kernels:
                stack_kspecs[spec]=kspecs[spec]
            else:
                if not home_data_dir in kspecs[spec]['resource_dir']:
                    stack_kspecs[spec]=kspecs[spec]
        return stack_kspecs
