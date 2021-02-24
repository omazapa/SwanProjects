try:
    from jupyter_client.discovery import KernelProviderBase
except ImportError:
    # Silently fail for version of jupyter_client that do not
    # yet have the discovery module. This allows us to do some
    # simple testing of this code even with jupyter_client<6
    KernelProviderBase = object

from jupyter_client.manager import KernelManager
from swanproject.ks_manager import SwanKernelSpecManager


class SwanKernelProvider(KernelProviderBase):
    id = 'swan'

    def __init__(self):
        self.sksm = SwanKernelSpecManager()

    def find_kernels(self):
        for name, data in self.sksm.get_all_specs().items():
            yield name, data['spec']

    def make_manager(self, name):
        return KernelManager(kernel_spec_manager=self.sksm, kernel_name=name)