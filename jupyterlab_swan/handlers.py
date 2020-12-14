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


class ProjectInfoHandler(APIHandler):
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
        path = os.environ['HOME'] + "/" + self.get_arguments("path",True)[0]
        print("PATH = "+str(path))
        project = self.isInsideProject(path)
        is_project = True if project is not None else False
        project_data={}
        if is_project:
            kernels_path = os.environ['HOME'] + "/" + project + "/.local/kernels"
            self.kernel_spec_manager.kernel_dirs = [kernels_path]
            print(kernels_path)
            print(self.kernel_spec_manager.get_all_specs())
            with open(project+os.path.sep+'.swanproject') as json_file:
                project_data = json.load(json_file)
            project_data["name"] = project.split(os.path.sep)[-1]
            project_data["readme"] = self.getProjectReadme(project)

        payload = {'status':True}
        self.finish(json.dumps(payload))

    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionnary with a key "name"
        input_data = self.get_json_body()
        print("input_data = ",input_data)
        is_project = input_data["is_project"]
        path = input_data["path"]

        project = self.isInsideProject(path)
        #is_project = True if project_path is not None else False
        project_data={}
        if is_project:
            #os.environ['JUPYTER_PATH'] = os.environ['HOME'] + "/" + project + "/.local"
            #kernelspec.SYSTEM_JUPYTER_PATH = SYSTEM_JUPYTER_PATH
            #kernelspec.SYSTEM_JUPYTER_PATH.append(os.environ['JUPYTER_PATH'])
            kernels_path = os.environ['HOME'] + "/" + project + "/.local/kernels"
            self.kernel_spec_manager.kernel_dirs = [kernels_path]
            print(kernels_path)
            print(self.kernel_spec_manager.get_all_specs())
            with open(project+os.path.sep+'.swanproject') as json_file:
                project_data = json.load(json_file)
            project_data["name"] = project.split(os.path.sep)[-1]
            project_data["readme"] = self.getProjectReadme(project)

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
        
        REPO = input_data["REPO"]
        PLATFORM = input_data["PLATFORM"] #SCRAM
        STACK = input_data["STACK"] #CMSSW
        KERNELS = input_data["KERNELS"]
        PROJECT_NAME = input_data["PROJECT_NAME"]

        PROJECT_DIR=os.environ["HOME"]+"/SWAN_projects/"+PROJECT_NAME
        for kernel in KERNELS:
            create_kernel_from_template(REPO, STACK, PLATFORM, kernel, PROJECT_DIR+"/.local/kernels")
        #create_cmd="/home/ozapatam/Projects/swan/jupyter_swan/bin/create_kernel_lab.sh"+" "+SCRAM+" "+CMSSW
        #create_cmd="swan_create_project "+PROJECT_NAME+" "+SCRAM+" "+CMSSW
        #print("Executing: "+create_cmd)
        #os.system(create_cmd)

        #JSON_PATH='/home/ozapatam/Projects/swan/jupyter_swan/'+SWANP_DIR+'/'+PROJECT_NAME+'/.kernel.json'
        #jfile=open(JSON_PATH)
        #kernel_content=jfile.read()
        #jfile.close()

        data = {"greetings": "executed create_kernel_from_template, kernels added: {}".format(KERNELS)}
        self.finish(json.dumps(data))


class MainKernelSpecHandler(APIHandler):
    #https://github.com/jupyter/notebook/blob/master/notebook/services/kernelspecs/handlers.py
    @tornado.web.authenticated
    @tornado.gen.coroutine
    def get(self):
        #global ksm
        #ksm = kernelspec.KernelSpecManager()
        print("--------- Inside MKSH ---------")
        ##print(ksm.get_all_specs())
        ksm = self.kernel_spec_manager
        km = self.kernel_manager
        model = {}
        model['default'] = km.default_kernel_name
        model['kernelspecs'] = specs = {}
        kspecs = yield maybe_future(ksm.get_all_specs())
        for kernel_name, kernel_info in kspecs.items():
            try:
                if is_kernelspec_model(kernel_info):
                    d = kernel_info
                else:
                    d = kernelspec_model(self, kernel_name, kernel_info['spec'], kernel_info['resource_dir'])
            except Exception:
                self.log.error("Failed to load kernel spec: '%s'", kernel_name, exc_info=True)
                continue
            specs[kernel_name] = d
        self.set_header("Content-Type", 'application/json')
        self.finish(json.dumps(model))


class KernelSpecHandler(APIHandler):
    
    @tornado.web.authenticated
    def get(self, kernel_name):
        #ksm = kernelspec.KernelSpecManager()
        print("--------- Inside KSH ---------")
        print(ksm.get_all_specs())
        kernel_name = url_unescape(kernel_name)
        try:
            spec = yield maybe_future(ksm.get_kernel_spec(kernel_name))
        except KeyError as e:
            raise tornado.web.HTTPError(404, u'Kernel spec %s not found' % kernel_name) from e
        if is_kernelspec_model(spec):
            model = spec
        else:
            model = kernelspec_model(self, kernel_name, spec.to_dict(), spec.resource_dir)
        self.set_header("Content-Type", 'application/json')
        self.finish(json.dumps(model))


# URL to handler mappings

kernel_name_regex = r"(?P<kernel_name>[\w\.\-%]+)"


def setup_handlers(web_app, url_path):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]
    print("URL_PATH="+url_path)
    # Prepend the base_url so that it works in a jupyterhub setting
    create_pattern = url_path_join(base_url, url_path, "create")
    project_pattern = url_path_join(base_url, url_path, "project/info")
    kernel_pattern = url_path_join(base_url, url_path, "kernels/info")
    kernelspec = url_path_join(base_url, "api", "kernelspecs")
    kernelspec_regex = url_path_join(base_url, "api", "kernelspecs/%s" % kernel_name_regex)
    print("kernel specs  = "+str(kernelspec))
    print("kernel specs regex = "+str(kernelspec_regex))
    #http://localhost:8888/api/kernelspecs
    handlers = [(create_pattern, CreateProjectHandler)]
    handlers.append((project_pattern,ProjectInfoHandler))
    handlers.append((kernel_pattern,KernelsInfoHandler))
    #handlers.append((kernelspec,MainKernelSpecHandler))
    #handlers.append((kernelspec_regex,KernelSpecHandler))

    web_app.add_handlers(host_pattern, handlers)

    # Prepend the base_url so that it works in a jupyterhub setting
    doc_url = url_path_join(base_url, url_path, "static")
    doc_dir = os.getenv(
        "JLAB_SERVER_EXAMPLE_STATIC_DIR",
        os.path.join(os.path.dirname(__file__), "static"),
    )
    handlers = [("{}/(.*)".format(doc_url), StaticFileHandler, {"path": doc_dir})]
    web_app.add_handlers(".*$", handlers)
