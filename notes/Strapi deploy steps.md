# Steps to deploy Strapi to DigitalOcean

[Guide for Strapi deployment, though a lot need to be changed or fixed](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/deployment/hosting-guides/digitalocean.html)

1. **_Do basic setup for Ubuntu, including_**

   - Set up firewall rule, either with `ufw` or DigitalOcean firewall. Be careful not to create any rule conflicts

   - Create an additional user with root privilege such that in case things go wrong we can still access the Linux machine via direct machine console in the DigitalOcean dashboard

   [Guide on initial server setup on Ubuntu](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04)

   [Setup public-private key authentication](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/about-ssh)

   [Common error on setup public-private key authentication](https://github.com/AnnLe4869/linode-learning/blob/main/7.7.%20Add%20new%20key%20beside%20id_rsa.md)

2. **_Install Git and NodeJS_**

   Follow the instruction on how to install Git and NodeJS in [PostgreSQL basic setup](/notes/PostgreSQL%20basic%20setup.md)

3. **_Clone the Strapi folder from GitHub_**

   Assumed that you already has a working-in-development Strapi app deployed to GitHub, we will clone it in `/root` and name it `strapi-deploy-test`

   Thus our app stays in `/root/strapi-deploy-test`

4. **_Install and set up PostgreSQL_**

   See [PostgreSQL basic setup](/notes/PostgreSQL%20basic%20setup.md)

   Note that we don't need to change location for `.npm-global` directory as instructed by the Strapi guide. Without changing the location of where global package is we still working fine.

   For simplicity, let create new superuser role named "strapi" and database name is "strapi-database"

   No need to create new Linux user of name "strapi" since we don't intend to use INDENT authentication

5. **_Setting up PostgreSQL for Strapi_**

   See [PostgreSQl setup for Strapi](/notes/PostgreSQL%20setup%20for%20Strapi.md)

   Don't forget to install `pg` package for Strapi since we use SQLite before in development

   The password for role "strapi" shall be "strapi"

   Set up the file `/config/database.js` as followed

   ```js
   module.exports = ({ env }) => ({
     defaultConnection: "default",
     connections: {
       default: {
         connector: "bookshelf",
         settings: {
           client: "postgres",
           host: env("DATABASE_HOST", "127.0.0.1"),
           port: env.int("DATABASE_PORT", 5432),
           database: env("DATABASE_NAME", "strapi-database"),
           username: env("DATABASE_USERNAME", "strapi"),
           password: env("DATABASE_PASSWORD", "strapi"),
         },
         options: {
           ssl: false,
         },
       },
     },
   });
   ```

6. **_`npm run build` your Strapi app_**

   To do this, we need to install all necessary npm package by running `npm install` in the app directory

   Then run `NODE_ENV=production npm run build` which specify the environment variable setup

   ---> Error when running `NODE_ENV=production npm run build` with message
   `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`

   Possible reason:

   - Our RAM and CPU is too small.

   Solution:

   - Try upgraded our Droplet

   ---> **Work** now after upgrade our Droplet to 2GB memory

7. **_Serve the file with `npm start`_**

   At this step we will have a running Strapi app with both server and database ready to go.

   We can test out whether it is working or not by running `curl http://localhost:1337/admin` and if we get a HTML back, the app is working.

   Why don't we test out actual content with `curl http://localhost:1337/products`? Because right now we don't have permission to access these yet and ~~we cannot access the website of Strapi app since we didn't set up Nginx~~.

   We can access Strapi now since we not yet set up Nginx. Just enable the port (step 8 below) and type in browser our public IP address with correct port (in our case, it's 1337) and we can interact with Strapi from there.

   ---> A big step here: our Strapi app is **WORKING**

8. **_Enable port 1337 (do we have to ???)_**

   DIDN'T DO THIS STEP

   Since with normal node app we didn't have to enable any port to use it if we use **INTERNALLY**

   If we want to access our Strapi app from external source (like a browser) then we have to enable the port. Just remember to disable the port later.

9. **_Configure Nginx_**

   We need to config Nginx so that we can access our Strapi app from external browser.

   Follow the instruction in [NGINX config](/notes/NGINX%20config.md) and [Nginx with Node](/notes/Nginx%20with%20Node.md) and [Nginx with dynamic route](/notes/Nginx%20with%20Dynamic%20route.md)

   To be specific, we have to to:

   - Enable Nginx with `ufw` by running `ufw allow 'Nginx Full'` for Nginx to accept both HTTP and HTTPS

   - Create a config file in `/etc/nginx/sites-available`. Let name it `strapi-deploy-test-config`

     In this `/etc/nginx/sites-available/strapi-deploy-test-config` file write the following:

     ```bash
     server {
        listen 80;
        listen [::]:80;

        server_name 147.182.207.107; # This is our server public IP address

        location / {
                proxy_pass http://127.0.0.1:1337; # 127.0.0.1 is self-inferred IP address and 1337 is the port Strapi use
                try_files $uri $uri/ =404;
        }
     }
     ```

   - Create a link to our `/etc/nginx/sites-available/strapi-deploy-test-config` in directory `/etc/nginx/sites-enabled` by running

     ```bash
     ln -s /etc/nginx/sites-available/strapi-deploy-test-config   /etc/nginx/sites-enabled/
     ```

   - Test to make sure there is no syntax error in our config file by running

     ```bash
     nginx -t
     ```

   - Restart Nginx to enable your changes by running

     ```bash
     systemctl restart nginx
     ```

   ---> **Error here**. We can connect to `/` route but in `/admin` route it throw 404 page

   **FIX**: remove the `/etc/nginx/sites-enabled/default` and change the config file `strapi-deploy-test-config` to

   ```bash
     server {
        listen 80;
        listen [::]:80;

        server_name 147.182.207.107; # This is our server public IP address

        location / {
                proxy_pass http://127.0.0.1:1337;
        }
    }
   ```

   The main reason for error before is due to the default file. Changing the config file only to make it cleaner and remove the unnecessary part

10. **_Install and Config PM2_**

    - If you didn't install PM2 before, run `npm install pm2@latest -g`. Let no install `build-essential` package for experiment purpose to see whether we need it or not.

    - Create a configuration file to organize multiple processes of PM2. This is more convenient in case of multiple processes since we can specify many properties of an app that unique for that app only. For example, environment variable (env), additional arguments, how we want to start the app (for example, React app has to start with `npm start`), etc.

      On how to set up the config file, [follow the instruction on PM2 config](/notes/PM2%20Config%20for%20Node%20app.md)

    - Edit the `ecosystem.config.js` as followed:

      ```js
      module.exports = {
        apps: [
          {
            name: "strapi",
            cwd: "/root/strapi-deploy-test",
            script: "npm",
            args: "start",
            // This set up environment variable
            // If in step 5 we use process.env.<variable> then we can specify the variable down here
            // If we already use all the value explicitly at step 5, no need for setting up the env variables below
            env: {
              NODE_ENV: "production",
              DATABASE_HOST: "localhost", // database endpoint
              DATABASE_PORT: "5432",
              DATABASE_NAME: "strapi-database", // DB name
              DATABASE_USERNAME: "strapi", // your username for psql
              DATABASE_PASSWORD: "strapi", // your password for psql
            },
          },
        ],
      };
      ```

---> A working Strapi app now
