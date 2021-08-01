# Steps to deploy static app with Nginx

1. Install Nginx

2. Create a directory to hold all of our static files. Let name it `our-static-files` and store it at `/root`.

   Usually we create this directory in the directory `/var/www/`, in our case `/var/www/our-static-files`

3. Create an `index.html` in the directory `our-static-files`

   ```html
   <html>
     <head>
       <title>Welcome to the website new user!</title>
     </head>
     <body>
       <h1>Success! The your_domain server block is working!</h1>
     </body>
   </html>
   ```

4. Create the config file in directory `/etc/nginx/sites-available/`. We will name this config file `static-files-config`

   ```bash
    server {
        listen 80;
        listen [::]:80;

        root /root/our-static-files;
        index index.html;

        server_name 147.182.207.107; # This is our server public IP address

        location / {
                try_files $uri $uri/ =404;
        }
    }
   ```

5. Create a link from our config file to directory `/etc/nginx/sites-enabled/`, in our case we run

   ```bash
   ln -s /etc/nginx/sites-available/static-files-config /etc/nginx/sites-enabled/
   ```

6. Edit the file `/etc/nginx/nginx.conf` at the part

   ```bash
   http {
       ...
       server_names_hash_bucket_size 64;
       ...
   }
   ```

7. Test to make sure there is no syntax error in our config file by running

   ```bash
   nginx -t
   ```

8. Restart Nginx to enable your changes by running

   ```bash
   systemctl restart nginx
   ```

---> Not working and we get the error 404 page

## Possible errors:

1. We need /html directory in our static files directory and the HTML files need to go there (error in step 3)
2. All the static content we want to server must be in directory `/var/www/` (error in step 2)
3. Config files incorrectly (step 4)

## Let try to fix this

1. Try to create a sub-directory `/html` in our source directory and put `index.html` there.  
   And edit the `/etc/nginx/sites-available/static-files-config` in the `root` section

   ---> Not working

2. Edit the `/etc/nginx/sites-available/static-files-config` as followed:

   ```bash
   server {
       listen 80;
       listen [::]:80;

       server_name 147.182.207.107; # This is our server public IP address

       location / {
               try_files $uri $uri/ =404;
               root /root/our-static-files;
       }
   }
   ```

   ---> Not working

3. Move the `our-static-files` into `/var/www/` so that we have `/var/www/our-static-files`
   Also edit the `root` section of the `/etc/nginx/sites-available/static-files-config` into

   ```bash
    server {
        listen 80;
        listen [::]:80;

        root /var/www/our-static-files/html;
        index index.html;

        server_name 147.182.207.107; # This is our server public IP address

        location / {
                try_files $uri $uri/ =404;
        }
    }
   ```

   ---> **Working now** and we can see the content of the HTML file. Searching around and the reason is Nginx doesn't have permission to read files in `/root` directory ([link to the answer here](https://stackoverflow.com/questions/52090897/nginx-cant-access-root-directory-in-sites-available)).

## Since we have a working version, let try this out

1. Add a second HTML file, let name it `about.html` into our folder `our-static-files/html`  
   And then modify the `/etc/nginx/sites-available/static-files-config` as followed

   ```bash
   server {
       listen 80;
       listen [::]:80;

       server_name 147.182.207.107; # This is our server public IP address

       location / {

          try_files $uri $uri/ =404; # If it cannot find files listed in index field below, show 404 page
          root /var/www/our-static-files/html;
          index index.html;
       }

       location /about/ {
          try_files $uri $uri/ =404;
          root /var/www/our-static-files/html;
          index about.html;
       }
   }
   ```

   ---> The `/` route on browser works and we see the content but the route `/about` throw error 404

2. Keep the `/etc/nginx/sites-available/static-files-config` same as above (with `/about` location of same set up) and create a new directory in `/html` called `about` and move the `about.html` into this directory.

   So now if we run `ls /var/www/our-static-files/html/` we will get result `index.html about` where `about` is a directory.

   ---> This works and we can view the content on both `/` and `/about`

   **WHY**: because the way Nginx figure out which file to send in response to what request.

   The way Nginx search for file path is by append the `location` and the `root`. In our case when the request coming to `147.182.207.107/about` the steps is:

   - From the request URL Nginx know it need to use `location /about` setting

   - It then constructs the path to our file: `/var/www/our-static-files/html` + `/about` = `/var/www/our-static-files/html/about` and in this directory it just figured out, it will search for the file

   - The files it will served in that directory is from the `index` field config. In our case since we do `index about.html;` it will search for `about.html` to serve

   - The file `/var/www/our-static-files/html/about/about.html` is sent back as response

   ---> In short, it comes down to how Nginx resolve the path to files

   [Stackoverflow answer for how to serve multiple route](https://stackoverflow.com/questions/54926687/nginx-configuration-for-multiple-static-sites-on-same-server-instance)

   [Nginx document on how the path to file is resolved](http://nginx.org/en/docs/http/ngx_http_core_module.html#root)

   [Nginx on how to server static files](https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/)

## Conclusions

- Our HTML files can be stored in any directory and not necessary to be in `/var/www` **AS LONG AS** Nginx has the permission to read files in that directory (anecdote is that Nginx cannot read files in `/root` directory). **HOWEVER** from security perspective, `/root` directory is not a good place to store file and should store those static files in `/var/www` ([Pitfall in config file](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#not-using-standard-document-root-locations))

- We can server multiple routes in same server (like `/`, `/about`, `/blog`, etc.) and all we need to do is to specify the location and route to the file to serve. Note on how Nginx resolve the file's path
