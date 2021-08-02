# Set up for Strapi

- If you use SQLite for development and want to use PostgreSQL for production, first install PostgreSQL on your Strapi project by running `npm install pg`

- Then create a new Linux user and a new PostgreSQL of same name and one database also of same name. For example, let create a user with name "strapiuser"

- Then change the role password since we sign in from external thus cannot use **INDENT** to sign in.  
  Do run `ALTER USER <your_role> PASSWORD '<new_password>';`  
  For example, `ALTER USER strapiuser PASSWORD 'my_new_password';`

  Note that these command is to be run in `psql` command prompt

- Take note the database name, database role name (NOT Linux username) and password for the role which we just set up above.

- Edit the `database.js` in the `config` folder as follow

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
        database: env("DATABASE_NAME", "database name go here"),
        username: env("DATABASE_USERNAME", "role name go here"),
        password: env(
          "DATABASE_PASSWORD",
          "role password - the thing we change last step and NOT THE Linux user's password"
        ),
      },
      options: {
        ssl: false,
      },
    },
  },
});
```
