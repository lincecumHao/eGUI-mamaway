#!/bin/bash

# reference sdk in current execution context
#export SDKMAN_DIR="$HOME/.sdkman"
#[[ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]] && source "$HOME/.sdkman/bin/sdkman-init.sh"

# optional: using java 11 in current execution
#sdk use java 11.0.2-open

remove_files() {
#  rm ./src/deploy.xml
  rm ./project.json
}

deploy() {
  suitecloud project:deploy
  #  remove_files
}

deployWithApplyInstallPrefs() {
  suitecloud project:deploy -a
    remove_files
}

# deploy project
branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
# branch is environment
DEPLOYFILE=./src/deploy-$branch.xml
echo "renaming $DEPLOYFILE"
if [ ! -f "$DEPLOYFILE" ]; then
  DEPLOYFILE=./src/deploy-master.xml
fi
echo "renamed $DEPLOYFILE"

PROJECTFILE=./project-$branch.json
echo "renaming $PROJECTFILE"
if [ ! -f "$PROJECTFILE" ]; then
  PROJECTFILE=./project-master.json
fi
echo "renamed $PROJECTFILE"

cp $DEPLOYFILE ./src/deploy.xml
cp $PROJECTFILE ./project.json

echo "$branch branch, deploy to $branch environment"
#deploy_development
deployWithApplyInstallPrefs
