from ._version import __version__  # noqa: F401
from .handlers import setup_handlers  # noqa: F401
from .kernelmanager import kernelspecmanager  # noqa: F401


def _jupyter_server_extension_paths():
    return [{"module": "swanprojects"}]


def load_jupyter_server_extension(lab_app):
    """Registers the API handler to receive HTTP requests from the frontend extension.
    Parameters
    ----------
    lab_app: jupyterlab.labapp.LabApp
        JupyterLab application instance
    """
    url_path = "swan"
    setup_handlers(lab_app.web_app, url_path)
    lab_app.log.info(
        "Registered swanprojects extension at URL path /{}".format(url_path)
    )

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
    
# For backward compatibility with the classical notebook
_load_jupyter_server_extension = load_jupyter_server_extension

