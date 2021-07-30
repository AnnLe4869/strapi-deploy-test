# Privilege in PostgreSQL

[Privilege table](https://www.postgresql.org/docs/12/ddl-priv.html#PRIVILEGE-ABBREVS-TABLE)

Let try out this scenario: You have 3 Linux user - the root default `postgres`, tim and john. You have 3 roles in PostgreSQL that you created when logged in as `postgres` by running `createuser`. tim is **SUPERUSER** and john is none.

Let sign in as tim and create a database called "tim_db"

Now sign back out and sign in as john. Logically, john shouldn't be able to access a database created by tim who is a **SUPERUSER**. However, if we run `psql -d tim_db` we see that we got access to "tim_db" which in theory we shouldn't be able to

What happened?

Well let's talk about privilege. All roles have privileges and these privileges defines what a role can do: can the role log in, can the role connect to a database, can a role update a table, etc.

This is defined **PER DATABASE** as each database has rules/privileges specified what a specific role can do. We can view the list pf privileges per role of a database by running `\l` in the database CLI (the thing pop up when we run `psql`)

For the explanation of the reading, refer to the [official doc](https://www.postgresql.org/docs/12/ddl-priv.html#PRIVILEGE-ABBREVS-TABLE)

In short, by default, when we create a role, it will have `PUBLIC` privilege. This `PUBLIC` privilege include the **connection** right to access to database. This explains why a non-SUPERUSER can access to any database where it shouldn't be able to

_SO what can we do?_

Well we can limit the privilege by explicitly specify what a role can do like using `GRANT` or `REVOKE`
