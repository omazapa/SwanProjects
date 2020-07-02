#!/bin/bash

SWANP_FILE=".swanproject"
SWANP_DIR="SWAN_projects"

PROJECT_NAME=$1
SCRAM_ARCH=$2
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
  \"$SCRAM_ARCH\",
  \"$CMSSW\",
  \"python3\",
  \"-f\",  
  \"{connection_file}\"
 ]
}" > $PROJECT_PATH/.kernel.json

touch $PROJECT_PATH/$SWANP_FILE
