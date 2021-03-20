### AWS Documentation

#### Example process

Spin an Amazon EC2 instance. Use an Amazon Linux machine optimized for EC2.

1.  Set Credit Specification to STANDARD (uncheck Unlimited).
2.  Add Security Group for HTTP (open port 80)
3.  [TODO] Add Security Group for HTTPS (open port 443)
4.  Launch Instance

SSH into instance

`ssh -i ./path_to/ssh_key ec2-user@ec2-3-133-108-43.us-east-2.compute.amazonaws.com`

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
-   `sudo chown -R ec2-user /usr/share/nginx/schackmatt/` to give `ec2-user` r/w rights

Then from `git/schackmatt`

-   Run whatever build script to put content in the `dist/` folder
-   `ssh -i "../../Google Drive/cwagner0" ec2-user@ec2-3-133-108-43.us-east-2.compute.amazonaws.com "sudo rm -rf /usr/share/nginx/schackmatt/*"`
-   `scp -r -i ./path_to/ssh_key ./dist/schackmatt/ ec2-user@ec2-3-133-108-43.us-east-2.compute.amazonaws.com:/usr/share/nginx`
