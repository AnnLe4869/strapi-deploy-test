# Role authentication

[Document on `CREATE ROLE`](https://www.postgresql.org/docs/8.2/sql-createrole.html)
[Document on `createuser`](https://www.postgresql.org/docs/13/app-createuser.html)

Ever notice that you have never type in any password when you try to connect to a database?

Let first talk about role and how Linux user is related to that.

Let say we have 2 Linux user "tim" and "john" and 2 PostgreSQL roles "tim" and "john"

Now sign in as Linux user "tim".

By default, PostgreSQL authenticate a Linux user with a role by **IDENT**. What this means is that it match the role based on the Linux username. So Linux user "tim" will have role "tim" by default.

This sounds strange but since each username within a Linux machine is unique and to sign in as a certain Linux user we already have to authenticate with the Linux machine. You can think of it as OAuth: you sign in with Linux machine and since each username is unique you can use that to authenticate with PostgreSQL also.

But this pose a problem: can Linux user "tim" use the role "john"?

Yes we can by changing the authentication method from **INDENT** to **PASSWORD BASED**. Usually do this only for external connection to database like for Strapi to connect to database
