import json

def get_path():
    return __file__[0:len(__file__)-9]

def get_software_stacks():
    stack_json = get_path()+"stacks.json"
    stacks={}
    with open(stack_json) as f:
        stacks=json.loads(f.read())
    return stacks
