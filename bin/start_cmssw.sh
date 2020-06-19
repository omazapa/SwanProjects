#!/bin/bash
SCRAM=$1
CMSSW=$2
PYTHON=$3

source /cvmfs/cms.cern.ch/cmsset_default.sh
cms_basedir=/cvmfs/cms.cern.ch
export PATH=${cms_basedir}/common:$PATH

#by default I will load the environment in the cvmfs path in read only
cd /cvmfs/cms.cern.ch/$SCRAM/cms/cmssw/$CMSSW
scramv1 runtime -sh
cd
#requires to prepend the lib and bin paths
export LD_LIBRARY_PATH=/cvmfs/cms.cern.ch/$SCRAM/cms/cmssw/$CMSSW/external/$SCRAM/lib/:$LD_LIBRARY_PATH
export PATH=/cvmfs/cms.cern.ch/$SCRAM/cms/cmssw/$CMSSW/external/$SCRAM/bin/:$PATH
which python2
echo $@
echo $PYTHON -m ipykernel_launcher $4 $5
$PYTHON -m ipykernel_launcher $4 $5
#python2 /home/ozapatam/Projects/swan/jupyter_swan/bin/start_ipykernel.py

