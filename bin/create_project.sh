#!/bin/bash

SWANP_FILE=".swanproject"
SWANP_DIR="SWAN_projects"

PROJECT_NAME=$1
SCRAM=$2
CMSSW=$3
PROJECT_PATH=/home/ozapatam/Projects/swan/jupyter_swan/$SWANP_DIR/$PROJECT_NAME

mkdir -p $PROJECT_PATH

SCRIPT_PATH=/home/ozapatam/Projects/swan/jupyter_swan/bin
echo "{
 \"display_name\": \"SCRAM: $SCRAM CMSSW:$CMSSW Python 3\",
 \"language\": \"python\",
 \"argv\": [
  \"/bin/bash\",  
  \"$SCRIPT_PATH/start_cmssw.sh\",
  \"$SCRAM\",
  \"$CMSSW\",
  \"python3\",
  \"$PROJECT_PATH/$CMSSW\",
  \"-f\",  
  \"{connection_file}\"
 ]
}" > $PROJECT_PATH/.kernel.json
cd $PROJECT_PATH
source /cvmfs/cms.cern.ch/cmsset_default.sh
export SCRAM_ARCH=$SCRAM
cms_basedir=/cvmfs/cms.cern.ch
export PATH=${cms_basedir}/common:$PATH

scramv1 project CMSSW $CMSSW

touch $PROJECT_PATH/$SWANP_FILE
