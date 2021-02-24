import os
import json

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

from notebook.utils import maybe_future, url_path_join, url_unescape

import tornado
from tornado.web import StaticFileHandler
from swankernels.config import get_kernels
from swankernels.generator import create_kernel_from_template


#from swankernels.manager import SwanKernelSpecManager
import os

from jupyter_client import kernelspec
#kernelspec.KernelSpecManager = SwanKernelSpecManager
from jupyter_client.kernelspecapp import KernelSpecApp  
from notebook.services.kernelspecs.handlers import is_kernelspec_model, kernelspec_model

from swanprojects.utils import is_inside_project, get_project_readme

class ProjectInfoHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server    

    @tornado.web.authenticated
    def get(self):
        path = self.get_arguments("path")[0]
        print("PATH = "+str(path))
        project = is_inside_project(path)
        is_project = True if project is not None else False
        self.kernel_spec_manager.set_project_path(path)
        print("project = "+str(project))
        if is_project:
            #kernels_path = os.environ['HOME'] + "/" + project + "/.local/kernels"
            #self.kernel_spec_manager.kernel_dirs = [kernels_path]
            #print(kernels_path)
            self.kernel_spec_manager.set_project_path(path)
            print(self.kernel_spec_manager.get_all_specs())

        payload = {'status':True}
        self.finish(json.dumps(payload))

    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionnary with a key "name"
        input_data = self.get_json_body()
        print("input_data = ",input_data)
        is_project = input_data["is_project"]
        path = input_data["path"]

        project = is_inside_project(path)
        self.kernel_spec_manager.set_project_path(project)
        if project is not None:
            print("Project = "+project)
        #is_project = True if project_path is not None else False
        project_data={}
        if is_project:
            #os.environ['JUPYTER_PATH'] = os.environ['HOME'] + "/" + project + "/.local"
            #kernelspec.SYSTEM_JUPYTER_PATH = SYSTEM_JUPYTER_PATH
            #kernelspec.SYSTEM_JUPYTER_PATH.append(os.environ['JUPYTER_PATH'])
            #kernels_path = os.environ['HOME'] + "/" + project + "/.local/kernels"
            #self.kernel_spec_manager.kernel_dirs = [kernels_path]
            #self.kernel_spec_manager.set_project_path(path)
            print(self.kernel_spec_manager.get_all_specs())
            with open(project+os.path.sep+'.swanproject') as json_file:
                project_data = json.load(json_file)
            project_data["name"] = project.split(os.path.sep)[-1]
            project_data["readme"] = get_project_readme(project)

        payload = {"project_data":project_data,"kernels":self.kernel_spec_manager.get_all_specs()}
        self.finish(json.dumps(payload))

class KernelsInfoHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server

    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({"kernels": get_kernels()}))
        pass

    @tornado.web.authenticated
    def post(self):
        self.finish(json.dumps({"kernels": get_kernels()}))
        pass


class CreateProjectHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({"data": "This is /swan/hello endpoint!"}))

    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionnary with a key "name"
        input_data = self.get_json_body()
        print(input_data)
        PROJECT_NAME = input_data["PROJECT_NAME"]
        SOURCE = input_data["SOURCE"]
        PLATFORM = input_data["PLATFORM"] #SCRAM
        STACK = input_data["STACK"] #CMSSW
        KERNELS = input_data["KERNELS"]
        USER_SCRIPT = input_data["USER_SCRIPT"]

        PROJECT_DIR=os.environ["HOME"]+"/SWAN_projects/"+PROJECT_NAME
        KERNEL_NAMES=[]
        for kernel in KERNELS:
            kernel_name = "{}_{}_{}_{}".format(SOURCE, STACK, PLATFORM, kernel)
            KERNEL_NAMES.append(kernel_name)
            create_kernel_from_template(SOURCE, STACK, PLATFORM, USER_SCRIPT, kernel, PROJECT_DIR+"/.local/kernels")
        
        swan_project_file = PROJECT_DIR+os.path.sep+'.swanproject'
        swan_project_content = {'source':SOURCE,'stack':STACK,'platform':PLATFORM,'kernels':KERNEL_NAMES,'user_script':USER_SCRIPT}
        
        with open(swan_project_file,'w') as f:
            f.write(json.dumps(swan_project_content, indent=4, sort_keys=True))
            f.close()
        
        data = {"greetings": "executed create_kernel_from_template, kernels added: {}".format(KERNELS)}
        self.finish(json.dumps(data))



# URL to handler mappings


def setup_handlers(web_app, url_path):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]
    print("URL_PATH="+url_path)
    # Prepend the base_url so that it works in a jupyterhub setting
    create_pattern = url_path_join(base_url, url_path, "project/create")
    project_pattern = url_path_join(base_url, url_path, "project/info")
    kernel_pattern = url_path_join(base_url, url_path, "kernels/info")
    #http://localhost:8888/api/kernelspecs
    handlers = [(create_pattern, CreateProjectHandler)]
    handlers.append((project_pattern,ProjectInfoHandler))
    handlers.append((kernel_pattern,KernelsInfoHandler))

    web_app.add_handlers(host_pattern, handlers)

    # Prepend the base_url so that it works in a jupyterhub setting
    doc_url = url_path_join(base_url, url_path, "static")
    doc_dir = os.getenv(
        "JLAB_SERVER_EXAMPLE_STATIC_DIR",
        os.path.join(os.path.dirname(__file__), "static"),
    )
    handlers = [("{}/(.*)".format(doc_url), StaticFileHandler, {"path": doc_dir})]
    web_app.add_handlers(".*$", handlers)
