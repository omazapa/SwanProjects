import os
import json

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

import tornado
from tornado.web import StaticFileHandler


class PathHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server

    def hasProjectFile(self,path):
        """
        Method to check if .swanproject exists
        path: path to check
        """
        return os.path.exists(path+os.path.sep+".swanproject")
    
    def getProjectReadme(self,project_path):
        readme_path=project_path+os.path.sep+"README.md"
        if os.path.exists(readme_path):
            f = open(readme_path, "r")
            text = f.read()
            f.close()
            return text
        return ""

    def isInsideProject(self,cwd):
        home = os.path.expanduser("~")
        paths =  cwd.split(os.path.sep)
        cwd_current = cwd
        for i in range(len(paths)):
            if self.hasProjectFile(home+os.path.sep+cwd_current):
                return cwd_current
            cwd_current=cwd_current[:-(len(paths[len(paths)-i-1])+1)]
        return None

    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({"data": "This is /swan/hello endpoint!"}))

    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionnary with a key "name"
        input_data = self.get_json_body()
        cwd = input_data["CWD"]
        project_path = self.isInsideProject(cwd)
        is_project = True if project_path is not None else False
        project_data={}
        if is_project:
            with open(project_path+os.path.sep+'.swanproject') as json_file:
                project_data = json.load(json_file)
            project_data["name"] = project_path.split(os.path.sep)[-1]
            project_data["readme"] = self.getProjectReadme(project_path)

        payload = {"is_project": is_project,"project_data":project_data}
        self.finish(json.dumps(payload))

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
        #SWANP_DIR="SWAN_projects"
        SCRAM = input_data["SCRAM"]
        CMSSW = input_data["CMSSW"]
        PROJECT_NAME = input_data["PROJECT_NAME"]
        #create_cmd="/home/ozapatam/Projects/swan/jupyter_swan/bin/create_kernel_lab.sh"+" "+SCRAM+" "+CMSSW
        create_cmd="/home/ozapatam/Projects/swan/jupyter_swan/bin/create_project.sh "+PROJECT_NAME+" "+SCRAM+" "+CMSSW
        os.system(create_cmd)

        #JSON_PATH='/home/ozapatam/Projects/swan/jupyter_swan/'+SWANP_DIR+'/'+PROJECT_NAME+'/.kernel.json'
        #jfile=open(JSON_PATH)
        #kernel_content=jfile.read()
        #jfile.close()

        data = {"greetings": "executed {}, kernel added".format(create_cmd)}
        self.finish(json.dumps(data))

def setup_handlers(web_app, url_path):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    # Prepend the base_url so that it works in a jupyterhub setting
    create_pattern = url_path_join(base_url, url_path, "create")
    path_pattern = url_path_join(base_url, url_path, "path")

    handlers = [(create_pattern, CreateProjectHandler),(path_pattern,PathHandler)]
    web_app.add_handlers(host_pattern, handlers)

    # Prepend the base_url so that it works in a jupyterhub setting
    doc_url = url_path_join(base_url, url_path, "static")
    doc_dir = os.getenv(
        "JLAB_SERVER_EXAMPLE_STATIC_DIR",
        os.path.join(os.path.dirname(__file__), "static"),
    )
    handlers = [("{}/(.*)".format(doc_url), StaticFileHandler, {"path": doc_dir})]
    web_app.add_handlers(".*$", handlers)
