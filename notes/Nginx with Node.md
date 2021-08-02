# Testing process: Step to deploy Nginx with normal Node app

1. Install Nginx

2. No setting up port 8008 with firewall `ufw` and still use it on NodeJS
   Testing with `curl localhost:8008` still work just fine

3. Create a file named `test-node-server-nginx` in the directory `/etc/nginx/sites-available` that has the content

   ```bash
   server {
         listen 80;
         listen [::]:80;

         server_name 147.182.207.107; # This is our server public IP address

         location / { # Only applied for request to `/` and not for `/admin` or else
                 proxy_pass http://127.0.0.1:8008; # 127.0.0.1 is self-inferred IP address and equivalent to localhost
                 try_files $uri $uri/ =404;
         }
   }
   ```

4. Edit the file `/etc/nginx/nginx.conf` at the part

   ```bash
   http {
       ...
       server_names_hash_bucket_size 64;
       ...
   }
   ```

5. ~~Unlink the file `/etc/nginx/sites-enabled/default`~~ by running `unlink /etc/nginx/sites-enabled/default`
   This will effectively remove the link file `default` in the directory `sites-enabled`.
   Can use command `rm` instead of `unlink`

   ---> ~~This is **NOT NECESSARY** for our app to run properly~~

6. Create a link to our `/etc/nginx/sites-available/test-node-server-nginx` in directory `/etc/nginx/sites-enabled` by running

   ```bash
   ln -s /etc/nginx/sites-available/test-node-server-nginx /etc/nginx/sites-enabled/
   ```

7. Test to make sure there is no syntax error in our config file by running

   ```bash
   nginx -t
   ```

8. Restart Nginx to enable your changes by running

   ```bash
   systemctl restart nginx
   ```

-----> **WORK NOW**

## Questions

1. Do we have to unlink the file `/etc/nginx/sites-enabled/default` ?

   I tested and it's OK to **NOT UNLINK** the file `/etc/nginx/sites-enabled/default`

   **HOWEVER** we REALLY should do that as per [Stackoverflow answer](https://stackoverflow.com/questions/45660042/nginx-proxy-pass-leads-to-404-not-found-page) and through own experience. It is also unnecessary.

2. Why it doesn't work before?

   Probably because several reasons:

   - We didn't restart the Nginx server to enable the change.
   - We didn't wait for the change to take effect i.e refresh the browser too fast
   - We didn't remove the default config file
   - The route is wrong. Remember the trailing slash (/) is very important
