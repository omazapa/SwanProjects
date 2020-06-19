
#PYTHON2=$(which python2)
#echo $PYTHON2
KERNEL_DIR=$HOME/.local/share/jupyter/kernels/
SCRAM=$1
CMSSW=$2

SCRIPT_PATH=/home/ozapatam/Projects/swan/jupyter_swan/bin
PYKERNELDIR=$KERNEL_DIR/$SCRAM"_"$CMSSW"_python3"
echo $PYKERNELDIR
mkdir -p $PYKERNELDIR
echo "{
 \"display_name\": \"SCRAM: $SCRAM CMSSW:$CMSSW Python 3\",
 \"language\": \"python\",
 \"argv\": [
  \"/bin/bash\",  
  \"$SCRIPT_PATH/start_cmssw.sh\",
  \"$SCRAM\",
  \"$CMSSW\",
  \"python3\",
  \"-f\",  
  \"{connection_file}\"
 ]
}" > $PYKERNELDIR/kernel.json

