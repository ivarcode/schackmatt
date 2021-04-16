# uncomment for debugging
set -x
sshKey=../../sshkeys/cwagner0
echo $sshKey
echo "Reading dev server IP address from deploymentConfig.json..."
sed -n 2p conf/deploymentConfig.json > tempFile.md
sed -i 's/    \"devServerIP\": \"//g' tempFile.md
sed -i 's/\",//g' tempFile.md
devIP=`cat tempFile.md`
echo "  :" $devIP
rm tempFile.md
echo "Attempting to remove files from nginx backup..."
ssh -i $sshKey $devIP "sudo rm -rf /usr/share/nginx/last_version_schackmatt/*"
echo "Moving current files over to nginx backup..."
ssh -i $sshKey $devIP "sudo mv /usr/share/nginx/schackmatt/* /usr/share/nginx/last_version_schackmatt/"
echo "Attempting to copy files from /dist to nginx..."
scp -r -i $sshKey ./dist/schackmatt/ $devIP:/usr/share/nginx
