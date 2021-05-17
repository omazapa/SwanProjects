from ._version import __version__  # noqa: F401
#from .handlers import _load_jupyter_server_extension  # noqa: F401
from .kernelmanager import kernelspecmanager  # noqa: F401
from  jupyter_server.serverapp import ServerApp
from  .handlers import CreateProjectHandler, EditProjectHandler, ProjectInfoHandler, StacksInfoHandler, KernelSpecManagerPathHandler

def _load_jupyter_server_extension(serverapp: ServerApp):
    """
    This function is called when the extension is loaded.
    """
    print("JupyterLab server extension swanprojects is activated!")
    host_pattern = ".*$"
    handlers = [
        ('/swan/project/create', CreateProjectHandler),
        ('/swan/project/edit', EditProjectHandler),
        ('/swan/project/info', ProjectInfoHandler),
        ('/swan/stacks/info', StacksInfoHandler),
        ('/swan/kernelspec/set',KernelSpecManagerPathHandler)
        
    ]
    serverapp.web_app.add_handlers('.*$', handlers)

def _jupyter_server_extension_paths():
    return [{"module": "swanprojects"}]


def _jupyter_server_extension_points():
    """
    Returns a list of dictionaries with metadata describing
    where to find the `_load_jupyter_server_extension` function.
    """
    return [
        {
            "module": "swanprojects"
        }
    ]

