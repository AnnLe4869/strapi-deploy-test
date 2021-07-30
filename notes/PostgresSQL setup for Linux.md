# Deployment

[Deploy to DigitalOcean Guide](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/deployment/hosting-guides/digitalocean.html)

## Remote push code to GitHub

- First need to establish SSH connection with public-private key (email and password connection is not secure)
- Follow the [instruction here](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/about-ssh). Remember to choose Linux as the OS system
- Create the new repository you want to push the code to. Note that in the **Quick Setup** you HAVE TO select the **SSH** option instead of normal _HTTPS_

## Install `nodejs`

- We will need to change the npm default directory (i.e where the package we install globally is stored)
- After that, nothing much

## Install PostgreSQL

[Set up PostgreSQL on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04)

- We install PostgreSQL by running `sudo apt install postgresql postgresql-contrib`

- By default, Postgres uses a concept called "roles" to handle in authentication and authorization. These are, in some ways, similar to regular Unix-style accounts, but Postgres does not distinguish between users and groups and instead prefers the more flexible term "role".

- Upon installation, Postgres is set up to use ident authentication, meaning that it associates Postgres roles with a matching Unix/Linux system account. If a role exists within Postgres, a Unix/Linux username with the same name is able to sign in as that role.  
   ---> In other words, we have a DEFAULT Linux account when installing Postgres and we can use this account to access the database and do some manipulation (like create new role, create new database, etc.)
  ---> This Default account when log onto PostgreSQL allows us to do some root action (like create database, create new role, etc.)

- The installation procedure created a user account called `postgres` that is _associated_ with the **default Postgres role** (this `postgres` is a **Linux account** that is used to work with PostgreSQL). In order to use Postgres, you can log into that account.

- To utilize this account to access Postgres, we can either _Switching Over to the `postgres` account_ or _Accessing a Postgres Prompt Without Switching Accounts_.  
  ---> Both will log you into the **PostgreSQL prompt** and from here you are free to interact with the database management system right away.

- **In other words**, we have a Linux account when installing PostgreSQL (namely `postgres`) and when we switch over to this account we can access the PostgreSQL and have all **root privilege** upon it (like create new role, create/delete database, etc.)

## Access to PostgreSQL CLI

We need to switch over to the `postgres` Linux account and then run the PostgreSQL CLI

```bash
# This basically switch the user from current user (i.e root) to postgre
sudo -i -u postgres
# Then we start the PostgreSQL command line interface as if the postgre user run the command
psql
```

The `-i` mean run login shell as the target user (in our case it's `postgres`). We can also understand `-i` as"sign in as this user and run the shell as such". Other words, simplified as "change the user to".

The `-u` mean run command (or edit file) as specified user name or ID (in our case it's `postgres`). We can understand this as the command will be run under the specified user. In our case since we didn't specify the command, any command we type after this will be run as if the `postgres` user run it.

Note that `sudo -i` is similar to `su` command in a sense that they all simply entered into another shell as that username; typing exit will leave that shell and return you to your root shell.

**ALTERNATIVELY**, we can access the Postgres CLI Without Switching Accounts by running

```bash
sudo -u postgres psql
```

---> Switching to `postgres` is better since the user `postgres` has **SUPERUSER** privilege and it's more convenient to work with PostgreSQL with this user than using `root` and keep having to do `sudo -u postgres<command>`

## Setting up role

- Reason is that we want to have multiple users that can use PostgreSQL and not just `postgres` user

- HOW-TO: If we already signed in as `postgres` then we do `createuser --interactive`.  
  If not (i.e signed in as root) we do `sudo -u postgres createuser --interactive`.  
  After that we will be prompt to enter the role's name and its privilege (whether it's superuser or not)

  ---> Note that `createuser` is a PostgreSQL-related command to create a new PostgreSQL user account and **NOT Linux account** (create new Linux user is `adduser`).

## Create new database

- Another assumption that the Postgres authentication system makes by default is that for any role used to log in, that role will have a **database with the same name** which it can access.  
  ---> Meaning that, a role `timmy` ~~~will have a database named `timmy` which it can access to~~~.

  **NO** a new role when created **DO NOT AUTOMATICALLY HAVE A DATABASE OF ITS NAME**. We have to manually create a database of that name.

- Only when you are ~~~logged in as `postgres` you can create new database~~~.

  ---> **NO** as long as the role is allowed to create new database you can do that using that role.

- When the role allowed for create new database, you can create new database by running `createdb <database_name>`  
  For example, `createdb my_new_database`

## Opening a Postgres Prompt with the New Role

- You can connect to any database as long as the database allow you to access it. This means that role `sammy` can try to access to database `john` and not be limited to only database `sammy`

- To access different database, run `psql -d <database_name>`  
  For example, `psql -d postgres`

- To log in with ident based authentication, you’ll need a Linux user with the same name as your Postgres role and database. In other words, to log in as `sammy` role of PostgresSQL, you need also be log in as `sammy` user of Linux machine.  
  ---> This means, a user can log in to PostgreSQL as a role of same name. This is how a non-root user can log into the PostgresSQL and access a database. If this is a non-root role, this role can be limited (for example, cannot create new database, cannot create new user, etc.)
