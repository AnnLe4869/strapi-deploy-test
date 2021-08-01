# PM2 config for Node app

[Quick start for PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)
[Set up a Node app for Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04)

## Install PM2 and start the Node app with PM2

Follow the quick start instruction and we are good to go.

And don't forget to install the `build-essential` package (this is Ubuntu package and run `apt install build-essential` to install it)

When run `pm2 start <file_name>` we should wait a bit before refresh the browser for the update.

PM2 is a daemon process manager that will help you manage and keep your application online. Daemon is a program that run in background, thus means that it will keep on running even when we close the current session (like close the terminal, which will kill normal Node app that run by `node <node_file_name>`)

In PM2 there is concept of process. Each app is assigned to a process and process is the "watchdog" that can start, reload or stop the app.

When we start a process, we can name the process with flag `--name`. This will help us identify which process run which file when we list out all running processes with `pm2 ls`

## Open port for our Node app (no need to do this)

Since our Node app use internal IP address thus our Node app has FULL ACCESS to the port (guess ??) and we can use `curl localhost:<port_number>` to fetch data internally

Thus we don't need to set up `ufw` firewall for the port our Node app going to use to server (like port 8000 if we run URL as localhost:8000)

External request will be blocked though since only certain ports are open for external request

## Set up Nginx with PM2

The job of PM2 is to monitor and start back the server in case of shutting down. It doesn't have anything to do with how we set up Nginx.

Basically we set up just like normal Node app running with `node <node_fle_name>`

For the instruction on how, [link to the instruction](/notes/Nginx%20with%20Node.md)

## Restart application on changes

As of right now, when we make change to the file, the change won't show up until we reload the process by running `pm2 reload <app_name>`

We can set up auto-restart application on changes by adding `--watch` option, like below

```bash
pm2 start <our_js_file> --watch --ignore-watch="node_modules"
```

The `--ignore-watch` is quite self-explanatory - the `node_modules` is ignored

## Restart app on system launch/reboot

PM2 only help the app restarted automatically if the application crashes or is killed (for example, an exception happen cause the app to crash) but not when the system launch/reboot. This system reboot may happen when our Linux machine get shut down or need reboot.

When system shut down or reboot, most of apps, including daemon like PM2 also stop. These won't automatically start when the system start up again and we need to have some script to instruct our system to start PM2 on launch for us. To do this we do:

1. Run `pm2 startup`

   This command will generate a script that we need to run in order for PM2 to run on launch

2. Copy the command generated above an run it.

3. Run `pm2 save` to save all currently running processes. These process will be respawn after reboot, meaning that after PM2 start at startup PM2 will start these processes

If we want PM2 to have root privilege on boot, we need to include `systemd` on the command at step 1 like so `pm2 startup systemd`

If we want to stop PM2 from boot at startup, run `pm2 unstartup systemd`

## CheatSheet

[Link to CheatSheet](https://pm2.keymetrics.io/docs/usage/quick-start/)

There are several important commands you should know

```bash

# Start in fork mode
pm2 start app.js --name my-api # Name process

# Listing
pm2 list               # Display all processes status
pm2 monit              # Monitor all processes

# Logs
pm2 logs        # Display all logs, including logs in the past
pm2 logs [--raw]       # Display all processes logs in streaming
pm2 flush              # Empty all log files

# Actions

pm2 stop all           # Stop all processes
pm2 restart all        # Restart all processes

pm2 reload all         # Will 0s downtime reload (for NETWORKED apps)

pm2 stop 0             # Stop specific process id
pm2 restart 0          # Restart specific process id

pm2 delete 0           # Will remove process from pm2 list
pm2 delete all         # Will remove all processes from pm2 list

# Misc
pm2 ping               # Ensure pm2 daemon has been launched
```
