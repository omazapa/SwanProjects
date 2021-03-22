import json

def get_path():
    return __file__[0:len(__file__)-9]

def get_templates_path():
    return get_path()+"templates/"

def get_kernels():
    kernels_json = get_path()+"kernels.json"
    kernels={}
    with open(kernels_json) as f:
        kernels=json.loads(f.read())
    return kernels
