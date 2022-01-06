#!/bin/bash

# reference sdk in current execution context
#export SDKMAN_DIR="$HOME/.sdkman"
#[[ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]] && source "$HOME/.sdkman/bin/sdkman-init.sh"

# optional: using java 11 in current execution
#sdk use java 11.0.2-open

remove_files() {
#  rm ./src/deploy.xml
  rm ./project.json
  cp ./InstallationPreferences/locking.xml ./src/InstallationPreferences/locking.xml
  cp ./InstallationPreferences/hiding.xml ./src/InstallationPreferences/hiding.xml
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
client_env=$branch
# branch is environment
PROJECT_FILE=./project-$branch.json
echo "renaming $PROJECT_FILE"
if [ ! -f "$PROJECT_FILE" ]; then
  # defaulting client env to master
  PROJECT_FILE=./project-master.json
fi
echo "renamed $PROJECT_FILE"

LOCKING_PREF=./InstallationPreferences/locking.xml
HIDING_PREF=./InstallationPreferences/hiding.xml
#if [ "$client_env" == "shopping99-sb" ] || [ "$client_env" == "auo-sb2" ]; then
if [ "$client_env" == "shopping99-sb" ] || [ "$client_env" == "master" ]; then
  LOCKING_PREF=./InstallationPreferences/unlocking.xml
  HIDING_PREF=./InstallationPreferences/unhiding.xml
fi

echo "copy locking preference $LOCKING_PREF"
echo "copy hiding preference $HIDING_PREF"

cp $HIDING_PREF ./src/InstallationPreferences/hiding.xml
cp $LOCKING_PREF ./src/InstallationPreferences/locking.xml
cp $PROJECT_FILE ./project.json

echo "$branch branch, deploy to $client_env environment"
#deploy_development
deployWithApplyInstallPrefs
