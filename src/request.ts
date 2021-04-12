import { URLExt } from '@jupyterlab/coreutils';

import { ServerConnection } from '@jupyterlab/services';
import { ProjectDialog } from './ProjectDialog';

/**
 * Call the API extension
 *
 * @param endPoint API REST end point for the extension
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
export async function request<T>(
  endPoint = '',
  init: RequestInit = {}
): Promise<T> {
  // Make request to Jupyter API
  const settings = ServerConnection.makeSettings();
  const requestUrl = URLExt.join(settings.baseUrl, '', endPoint);

  let response: Response;
  try {
    response = await ServerConnection.makeRequest(requestUrl, init, settings);
  } catch (error) {
    throw new ServerConnection.NetworkError(error);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ServerConnection.ResponseError(response, data.message);
  }

  return data;
}

/**
 * @param cwd path get information from jupyter api
 * @returns json object with the information of the path or json object with the information of the error.
 */
export function contentRequest(cwd: string): any {
  try {
    return request<any>('api/contents/' + cwd, {
      method: 'GET'
    }).then(rvalue => {
      return rvalue;
    });
  } catch (reason) {
    const msg = `Error on GET 'api/contents'+ ${cwd}.\n${reason}`;
    console.error(msg);
    return { status: 'error', reason: reason, param: cwd, msg: msg };
  }
}

/**
 * @param options
 */
export function createProjectRequest(options: ProjectDialog.ISWANOptions): any {
  const dataToSend = {
    name: options.name,
    stack: options.stack,
    release: options.release,
    platform: options.platform,
    user_script: options.user_script
  };
  try {
    return request<any>('swan/project/create', {
      body: JSON.stringify(dataToSend),
      method: 'POST'
    }).then(rvalue => {
      console.log('-create-post');
      console.log(rvalue);
      return rvalue;
    });
  } catch (reason) {
    console.error(`Error on POST /swan/project/create ${options}.\n${reason}`);
  }
}

/**
 * @param old_name
 * @param options
 */
export function editProjectRequest(
  old_name: string,
  options: ProjectDialog.ISWANOptions
): any {
  const dataToSend = {
    old_name: old_name,
    name: options.name,
    stack: options.stack,
    release: options.release,
    platform: options.platform,
    user_script: options.user_script
  };
  try {
    return request<any>('swan/project/edit', {
      body: JSON.stringify(dataToSend),
      method: 'POST'
    }).then(rvalue => {
      return rvalue;
    });
  } catch (reason) {
    console.error(
      `Error on POST 'swan/project/edit'+ ${dataToSend}.\n${reason}`
    );
  }
}
