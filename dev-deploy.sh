sshKey="./sshkeys/cwagner0"
devIP=
echo 
ssh -i $sshKey $devIP "sudo rm -rf /usr/share/nginx/schackmatt/*