#!/bin/bash
set -e

# Get latest tarball from master
echo "Fetching rpbot latest tarball from GitHub..."
wget -q -O rpbot-master.tar.gz https://github.com/dennmart/rpbot/tarball/master

if [ ! -s rpbot-master.tar.gz ]
then
  echo "There was an error fetching the latest tarball from GitHub - Try again later"
  exit 1
fi

# Uncompress in current directory
echo "Uncompressing..."
tar --strip-components=1 -zxf rpbot-master.tar.gz

# Make sure all Node dependencies are installed
echo "Verifying Node.js dependencies..."
npm install

# Overwrite placeholder config.js from repo with real config.js
echo "Setting config.js..."
cp config.js.default config.js

# Restart the app using Forever
echo "Restarting rpbot..."
forever restart index.js

# Cleanup
echo "Cleaning up..."
rm -f rpbot-master.tar.gz
