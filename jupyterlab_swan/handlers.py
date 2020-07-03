import os
import json

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

import tornado
from tornado.web import StaticFileHandler


class RouteHandler(APIHandler):
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
        SWANP_DIR="SWAN_projects"
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
    route_pattern = url_path_join(base_url, url_path, "hello")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)

    # Prepend the base_url so that it works in a jupyterhub setting
    doc_url = url_path_join(base_url, url_path, "static")
    doc_dir = os.getenv(
        "JLAB_SERVER_EXAMPLE_STATIC_DIR",
        os.path.join(os.path.dirname(__file__), "static"),
    )
    handlers = [("{}/(.*)".format(doc_url), StaticFileHandler, {"path": doc_dir})]
    web_app.add_handlers(".*$", handlers)
