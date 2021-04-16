### AWS Documentation

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
-   `sudo certbot certonly`
    -   follow the instructions

Use the following commands to install nginx and prepare a webserver on the Linux instance.

-   `sudo amazon-linux-extras install nginx1`
-   `sudo vi /etc/nginx/nginx.conf`
-   Ensure the `worker_processes` value is set to `auto`
-   Include the following `location` block in the `server` to ensure proper URI routing and set the root directory to the following as well.

```
server {
    ...
    root /usr/share/nginx/schackmatt;
    location / {
        try_files $uri $uri/ /index.html;
    }
    ...
}
```

-   `sudo nginx -s reload` to reload server with new configurations
-   Create two new directories `schackmatt/` and `last_version_schackmatt/` in `/usr/share/nginx`
-   Use `chown` to give `ec2-user` r/w rights to both directories
    -   eg. `sudo chown -R ec2-user /usr/share/nginx/schackmatt/`

Then from `git/schackmatt`

-   Run whatever build script to put content in the `dist/` folder
-   Run the dev server deployment script

`bash dev-deploy.sh`

-   OR run the commands manually like so:
    -   `ssh -i ./path_to/ssh_key ec2-user@ec2HOSTNAME "sudo rm -rf /usr/share/nginx/last_version_schackmatt/*"`
    -   `ssh -i ./path_to/ssh_key ec2-user@ec2HOSTNAME "sudo mv /usr/share/nginx/schackmatt/* /usr/share/nginx/last_version_schackmatt/"`
    -   `scp -r -i ./path_to/ssh_key ./dist/schackmatt/ ec2-user@ec2HOSTNAME:/usr/share/nginx`
