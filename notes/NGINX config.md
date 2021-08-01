# NGINX config

[Instruction on how to setup Nginx](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04)

[Instruction on initial setup Linux machine](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04)

[Nginx Beginner guide](https://nginx.org/en/docs/beginners_guide.html#conf_structure)

## Install and Checkup

Follow the instruction on how to set up Nginx and stop after finishing Step 4: Managing the Nginx Process

## Setup server block (recommended)

This allows us to host more than one domain from a single server. For example, our server `hello_server` can server traffic from both `https://hello.com` and `http://your-name.com`.

Note that the domain name you use in the setup here must be register with DigitalOcean DNS.

Important directory is `/sites-enabled/default` as this define what to go where. And the file structure is of **multiple of `server` object** that of the shape, and each of the `server` object define a server that can be served. Which means if we have 2 different server of different `server_name` we can serve 2 different app from those URL with just one machine.

```bash
server {
      listen 80;
      listen [::]:80;

      server_name example.com;

      root /var/www/example.com;
      index index.html;

      location / {
              try_files $uri $uri/ =404;
      }
}
```

where

- `listen` specify the port that will be used for this server. Since we use port 80, that means the request is expected to be HTTP

- `server_name` define what is the URL (we can use IP address here) the request come from. This can be understood as "this server will server the request from this `server_name` only, and in our case it is "example.com"

- `root` define where to find the file that will be serve to the request. Note that this is the path to the directory that contains the file to serve, not the file that to be server

- `index` define what file shall be served

Usually we don't write directly into the `sites_enabled/default` but write into `sites_available` and then create a link of that file into `sites_enable` directory. We do so by running `ln -s /sites-available/<your directory> /etc/nginx/sites-enabled/`

Note that the name for this file in `sites-available` can be anything you want. The only name you must be correct is `server_name` - for which URL you want to serve these files.

Also the above example is for **STATIC FILES SERVING** and not for server/dynamic serving where we run a server and let let it listen to the request and response to it accordingly.
