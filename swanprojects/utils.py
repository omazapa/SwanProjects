import os
import json


def get_path():
    return __file__[0:len(__file__) - 9]


def get_software_stacks():
    stack_json = get_path() + "/stacks.json"
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


def get_project_path(cwd):
    paths = cwd.split(os.path.sep)
    cwd_current = cwd
    for i in range(len(paths)):
        if has_project_file(cwd_current):
            return cwd_current
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


def get_user_script_content(project_path):
    user_script_path = project_path + os.path.sep + ".userscript"
    if os.path.exists(user_script_path):
        f = open(user_script_path, "r")
        text = f.read()
        f.close()
        return text
    else:
        return ""


def get_project_name(project_path):
    path = get_project_path(project_path)
    name = None
    if path is not None:
        name = path.split('/')[-1]
    return name


def check_project_info(project_info):
    """
    Allows to check if the .swanproject file content is corrupted.
    """
    project_keys = ["stack", "platform", "release",
                    "user_script", "python3", "python2", "kernel_dirs"]
    not_found = []
    status = True
    for key in project_keys:
        if key not in project_info.keys():
            status = False
            not_found.append(key)
    return {"status": status, "not_found": not_found}
