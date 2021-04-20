# uncomment for debugging
# set -x
sshKey=../../sshkeys/cwagner0
echo $sshKey
echo "Reading dev server IP address from deploymentConfig.json..."
sed -n 3p conf/deploymentConfig.json > tempFile.md
sed -i 's/    \"prodServerIP\": \"//g' tempFile.md
sed -i 's/\"//g' tempFile.md
prodIP=`cat tempFile.md`
echo "  :" $prodIP
rm tempFile.md
echo "Attempting to remove files from nginx backup..."
ssh -i $sshKey $prodIP "sudo rm -rf /usr/share/nginx/last_version_schackmatt/*"
echo "Moving current files over to nginx backup..."
ssh -i $sshKey $prodIP "sudo mv /usr/share/nginx/schackmatt/* /usr/share/nginx/last_version_schackmatt/"
echo "Attempting to copy files from /dist to nginx..."
scp -r -i $sshKey ./dist/schackmatt/ $prodIP:/usr/share/nginx
