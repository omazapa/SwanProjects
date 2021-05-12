from ._version import __version__  # noqa: F401
from .handlers import _load_jupyter_server_extension  # noqa: F401
from .kernelmanager import kernelspecmanager  # noqa: F401


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

