import os
import json

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

from notebook.utils import maybe_future, url_path_join, url_unescape

import tornado
from tornado.web import StaticFileHandler
from swanprojects.config import get_kernels
# from swankernels.generator import create_kernel_from_template


#from swankernels.manager import SwanKernelSpecManager
import os

from jupyter_client import kernelspec
#kernelspec.KernelSpecManager = SwanKernelSpecManager
from jupyter_client.kernelspecapp import KernelSpecApp  
from notebook.services.kernelspecs.handlers import is_kernelspec_model, kernelspec_model

from swanprojects.utils import project_path, get_project_info, get_project_readme

import subprocess

class ProjectInfoHandler(APIHandler):


    @tornado.web.authenticated
    def post(self):
        """
        Post request is for the SwanLauncher/SwanFileBrowser and returns project information required for the launcher 
        """
        # input_data is a dictionnary with a key "name"
        input_data = self.get_json_body()
        print("input_data = ",input_data)
        path = input_data["path"]
        project = project_path(path)
        self.kernel_spec_manager.set_path(path)
        project_data={}
        if project is not None:
            project_data = get_project_info(project)
            
            project_data["name"] = project.split(os.path.sep)[-1]
            readme = get_project_readme(project)
            if readme is not None:
                project_data["readme"] = readme
        payload = {"project_data":project_data}
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
        os.makedirs(PROJECT_DIR)
        swan_project_file = PROJECT_DIR+os.path.sep+'.swanproject'
        swan_project_content = {'source':SOURCE,'stack':STACK,'platform':PLATFORM,'user_script':USER_SCRIPT}
        
        with open(swan_project_file,'w+') as f:
            f.write(json.dumps(swan_project_content, indent=4, sort_keys=True))
            f.close()
        
        command =  ["swan_kmspecs","--source",SOURCE,"--stack",STACK,"--platform",PLATFORM,"--user_script",USER_SCRIPT,"--project_path",PROJECT_DIR]
        print(" ".join(command))
        proc = subprocess.Popen(command, stdout = subprocess.PIPE)
        proc.wait()
        data = proc.stdout.read().decode("utf-8")
        print(data)
        proc.communicate()
        #if proc.returncode !=0 :
            #print("Error creating project for {} in project {}".format(python_version,project_path))

        
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
