### AWS Documentation

#### Deployment Configuration (local)

To use the `.sh` scripts written for deployment, you need to have a valid sshkey (currently the only valid key is `cwagner0`) at `../../sshkeys/` relation to your checkout. Having this sshkey as default also works.

The following deployment configuration should look like this:

`/conf/deploymentConfig.json`

```
{
    "devServerIP": "ec2-user@ec2-<REDACTED_IP_ADDRESS>.us-east-2.compute.amazonaws.com",
    "prodServerIP": "ec2-user@ec2-<REDACTED_IP_ADDRESS>.us-east-2.compute.amazonaws.com"
}
```

#### Example process

Spin an Amazon EC2 instance. Use an Amazon Linux machine optimized for EC2. Choose t3.nano (or other).

1.  Set Credit Specification to STANDARD (uncheck Unlimited).
2.  Add Security Group for HTTP (open port 80)
3.  Add Security Group for HTTPS (open port 443) _if using SSL_
4.  Launch Instance

SSH into instance

`ssh -i ./path_to/ssh_key ec2-user@ec2HOSTNAME`

Use the following commands to install the Let's Encrypt client, `certbot`.

-   `sudo yum update` (not completely necessary)
-   `sudo amazon-linux-extras install epel -y`
-   `sudo yum install -y certbot`
-   `sudo yum install -y python-certbot-nginx`

Use the following commands to install nginx and prepare a webserver on the Linux instance.

-   `sudo amazon-linux-extras install nginx1`
-   `sudo vi /etc/nginx/nginx.conf`
-   Ensure the `worker_processes` value is set to `auto`
-   Include the following `location` block in the `server` to ensure proper URI routing and set the root directory to the following as well. Add a server_name (or multiple) if you require SSL.

```
server {
    ...
    root /usr/share/nginx/schackmatt;
    server_name schackmatt.net;
    ...
}
```

To generate a cert for your domain:

-   `sudo certbot --nginx`
    -   follow the instructions

Add the location block directly BELOW the `server_name` and `root` AFTER generating the cert:

```
server {
    ...
    location / {
        try_files $uri $uri/ /index.html;
    }
    ...
}
```

Then to prepare the location for the files:

-   `sudo nginx -s reload` to reload server with new configurations
-   Create two new directories `schackmatt/` and `last_version_schackmatt/` in `/usr/share/nginx`
-   Use `chown` to give `ec2-user` r/w rights to both directories
    -   eg. `sudo chown -R ec2-user /usr/share/nginx/schackmatt/`

Add a cronjob to automatically renew the cert if necessary:

-   `crontab -e`
-   Add (for example) the line `0 12 * * * /usr/bin/certbot renew --quiet` to check to renew everyday at noon.

Then from `git/schackmatt`

-   Run whatever build script to put content in the `dist/` folder
-   Run the dev server deployment script

`bash deploy-dev.sh`
`base deploy-prod.sh`

-   OR run the commands manually like so:
    -   `ssh -i ./path_to/ssh_key ec2-user@ec2HOSTNAME "sudo rm -rf /usr/share/nginx/last_version_schackmatt/*"`
    -   `ssh -i ./path_to/ssh_key ec2-user@ec2HOSTNAME "sudo mv /usr/share/nginx/schackmatt/* /usr/share/nginx/last_version_schackmatt/"`
    -   `scp -r -i ./path_to/ssh_key ./dist/schackmatt/ ec2-user@ec2HOSTNAME:/usr/share/nginx`
