# Strapi

[Quick Start Guide](https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html)

## Installation

```bash
npx create-strapi-app <my_project_name>
```

If we want to use the default database, which is SQLite, you can add flag `--quickstart`. Otherwise, we need to specify which database we want to use (MongoDB, PostgreSQL, MySQL, etc.)

## Register the admin user

Register a user as admin.

Note that we use port `1337` on the `localhost`

## Create content

- In the `Plugins` panel, select Content-Types Builder. The part we want to focus on is `COLLECTION TYPES`

- You can think of `COLLECTION TYPES` as a **Schema** or a JavaScript class. `COLLECTION TYPES` define a shape a data of this type must have (like a User type must have property `username` as text, `email` as email, etc.), and base on this type we create data accordingly.

- `Component` is a group of fields that we can reuse on the `COLLECTION TYPES`

## Field settings

- Each field has 2 settings we can do at the same time: basic and advances
- **Basic** sets up name and type: either short text or long text (difference is on search ability)
- **Advance** set up default value, regular expression (what the value can be), is it required field, is it have to be unique, max/min length and _private field_ (this will make the value won't show up on API), etc.

- `Relation` collection type is the type the connect _a field of one type_ to another type (for example, the field `author` of type `Book` should like to type `Person`).
- When select the `Relation` collection type, we need to specify the field name and the relationship (like 1-to-1, 1-to-many, many-to-many, etc.)
