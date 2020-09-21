#!/bin/bash

SWANP_FILE=".swanproject"
SWANP_DIR="SWAN_projects"

PROJECT_NAME=$1
SCRAM=$2
CMSSW=$3
PROJECT_PATH="$HOME/$SWANP_DIR/$PROJECT_NAME"

mkdir -p $PROJECT_PATH

SCRIPT_PATH=/home/ozapatam/Projects/swan/jupyter_swan/bin
KERNEL_DIR=$HOME/.local/share/jupyter/kernels/
PY3KERNELNAME=$(echo $SCRAM"_"$CMSSW"_python3" | tr '[:upper:]' '[:lower:]')
PY3KERNELDIR=$KERNEL_DIR/$PY3KERNELNAME
echo $PY3KERNELDIR
mkdir -p $PY3KERNELDIR

echo "{
 \"display_name\": \"Python 3\",
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
}" > $PY3KERNELDIR/kernel.json
cp /home/ozapatam/Projects/swan/jupyter_swan/style/kernels/python/*.png $PY3KERNELDIR/

PY2KERNELNAME=$(echo $SCRAM"_"$CMSSW"_python2" | tr '[:upper:]' '[:lower:]')
PY2KERNELDIR=$KERNEL_DIR/$PY2KERNELNAME
echo $PY2KERNELDIR
mkdir -p $PY2KERNELDIR
echo "{
 \"display_name\": \"Python 2\",
 \"language\": \"python\",
 \"argv\": [
  \"/bin/bash\",  
  \"$SCRIPT_PATH/start_cmssw.sh\",
  \"$SCRAM\",
  \"$CMSSW\",
  \"python2\",
  \"$PROJECT_PATH/$CMSSW\",
  \"-f\",  
  \"{connection_file}\"
 ]
}" > $PY2KERNELDIR/kernel.json
cp /home/ozapatam/Projects/swan/jupyter_swan/style/kernels/python/*.png $PY2KERNELDIR/


cd $PROJECT_PATH
source /cvmfs/cms.cern.ch/cmsset_default.sh
export SCRAM_ARCH=$SCRAM
cms_basedir=/cvmfs/cms.cern.ch
export PATH=${cms_basedir}/common:$PATH

scramv1 project CMSSW $CMSSW

touch $PROJECT_PATH/$SWANP_FILE
  
echo '{"kernels":["'$PY3KERNELNAME'","'$PY2KERNELNAME'"],"stack_name":"'$CMSSW' SCRAM: '$SCRAM'" }' > $PROJECT_PATH/$SWANP_FILE 