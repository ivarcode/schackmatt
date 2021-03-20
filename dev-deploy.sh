sshKey="./sshkeys/cwagner0"
sed -n 2p conf/deploymentConfig.json > tempFile.md
sed -i 's/    \"devServerIP\": \"//g' tempFile.md
sed -i 's/\",//g' tempFile.md
devIP=`cat tempFile.md`
echo "Reading dev server IP address from deploymentConfig.json..."
echo "  :" $devIP
rm tempFile.md
echo "Attempting to remove files from nginx..."
ssh -i $sshKey $devIP "sudo rm -rf /usr/share/nginx/schackmatt/*"
echo "Attempting to copy files from /dist to nginx..."
scp -r -i $sshKey ./dist/schackmatt/ $devIP:/usr/share/nginx
