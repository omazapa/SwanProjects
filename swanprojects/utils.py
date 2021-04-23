import os
import json


def get_path():
    return __file__[0:len(__file__) - 9]


def get_software_stacks():
    stack_json = get_path() + "stacks.json"
    stacks = {}
    with open(stack_json) as f:
        stacks = json.loads(f.read())
    return stacks


def get_kernel_resorces_path():
    resources_path = get_path() + "/kernelmanager/resources"
    return resources_path


def has_project_file(path):
    """
    Method to check if .swanproject exists
    path: path to check
    """
    return os.path.exists(path + os.path.sep + ".swanproject")


def get_project_info(path):
    if has_project_file(path):
        swanfile = path + os.path.sep + ".swanproject"
        with open(swanfile) as json_file:
            data = json.load(json_file)
        return data
    else:
        None


def project_path(cwd):
    home = os.path.expanduser("~")
    paths = cwd.split(os.path.sep)
    cwd_current = cwd
    for i in range(len(paths)):
        if has_project_file(home + os.path.sep + cwd_current):
            return home + os.path.sep + cwd_current
        cwd_current = cwd_current[:-(len(paths[len(paths) - i - 1]) + 1)]
    return None


def get_project_readme(project_path):
    readme_path = project_path + os.path.sep + "README.md"
    if os.path.exists(readme_path):
        f = open(readme_path, "r")
        text = f.read()
        f.close()
        return text
    else:
        return None
