### AWS Documentation

#### Example process

Spin an Amazon EC2 instance. Use an Amazon Linux machine optimized for EC2.

1.  Set Credit Specification to STANDARD (uncheck Unlimited).
2.  Add Security Group for HTTP (open port 80)
3.  [TODO] Add Security Group for HTTPS (open port 443)
4.  Launch Instance

Use the following commands to install nginx and prepare a webserver on the Linux instance.

-   `sudo amazon-linux-extras install nginx1`
-   `sudo vi /etc/nginx/nginx.conf` and ensure the `worker_processes` value is set to `auto`

Then from `git/schackmatt`

-   `scp -r -i /path_to_ssh_key/cwagner0 ./dist/ ec2-user@ec2-3-133-108-43.us-east-2.compute.amazonaws.com:~/schackmatt`
