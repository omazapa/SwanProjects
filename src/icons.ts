import { LabIcon } from '@jupyterlab/ui-components';

import swanProjectIconStr from '../style/project.svg';
import swanProjectImportIconStr from '../style/cloud-download-alt.svg';
import swanReadmeIconStr from '../style/list-alt.svg';
import swanConfigIconStr from '../style/cog.svg';
import swanProjectsIconStr from '../style/project-diagram.svg';

import cernboxIconStr from '../style/cernbox.svg';
import cmsIconStr from '../style/cms.svg';
import condaIconStr from '../style/anaconda_logo_circle.svg';
import sftIconStr from '../style/sft.svg';

export const swanProjectIcon = new LabIcon({
  name: 'jupyterlab_swan:project',
  svgstr: swanProjectIconStr
});

export const swanProjectImportIcon = new LabIcon({
  name: 'jupyterlab_swan:project_import',
  svgstr: swanProjectImportIconStr
});

export const swanReadmeIcon = new LabIcon({
  name: 'jupyterlab_swan:reame',
  svgstr: swanReadmeIconStr
});

export const swanConfigIcon = new LabIcon({
  name: 'jupyterlab_swan:config',
  svgstr: swanConfigIconStr
});

export const swanProjectsIcon = new LabIcon({
  name: 'jupyterlab_swan:projects',
  svgstr: swanProjectsIconStr
});

export const cernboxIcon = new LabIcon({
  name: 'jupyterlab_swan:cernbox',
  svgstr: cernboxIconStr
});

export const cmsIcon = new LabIcon({
  name: 'jupyterlab_swan:cms',
  svgstr: cmsIconStr
});

export const condaIcon = new LabIcon({
  name: 'jupyterlab_swan:conda',
  svgstr: condaIconStr
});

export const sftIcon = new LabIcon({
  name: 'jupyterlab_swan:sft',
  svgstr: sftIconStr
});
