# Strapi

[Quick Start Guide](https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html)
[Brad Video guide](https://www.youtube.com/watch?v=6FnwAbd2SDY)

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
- `Single Type` is the type where we only have **ONE INSTANCE** of the type (in comparison, `COLLECTION TYPES` can have multiple instances)

## Field settings

- Each field has 2 settings we can do at the same time: basic and advances
- **Basic** sets up name and type: either short text or long text (difference is on search ability)
- **Advance** set up default value, regular expression (what the value can be), is it required field, is it have to be unique, max/min length and _private field_ (this will make the value won't show up on API), etc.

- `Relation` collection type field is the type the connect _a field of one type_ to another type (for example, the field `author` of type `Book` should like to type `Person`).
- When select the `Relation` collection type, we need to specify the field name and the relationship (like 1-to-1, 1-to-many, many-to-many, etc.)

## Adding new data based off the collection

On `Collection Types` select the type you want to create data based upon (i.e what type of shape your data should have) and hit `Add new Category`

## Permission

[User role and Permission doc](https://strapi.io/documentation/developer-docs/latest/development/plugins/users-permissions.html)

By default, no one can access the data from our Strapi app even it is from the local machine the Strapi is on (which mean `localhost:1337/products` is not gonna work)

---> We need to change the permission in `Roles and Permissions`, which usually can be found the Settings

We change the permissions in the `Roles` (the one that have Authenticated and Public) and change some settings here. In specific, what can a user do if they are public vs Authenticated.

For `PUT` and `DELETE` we usually want to authenticate an user first and check his role. To create a user we can create one on the `User` collection type and select `Confirmed` field to `true`

## API Endpoints

[API Endpoint doc](https://strapi.io/documentation/developer-docs/latest/developer-resources/content-api/content-api.html#endpoints)

We can perform API request to get the data from Strapi server. Syntax

- `GET http://localhost:1337/<collection_type>` to get the list of entries of that of the `<collection_type>`
- `GET http://localhost:1337/<collection_type>/count` to get the count of entries matching the query filter
- `GET http://localhost:1337/<collection_type>/<id>` to get the a specific object of the type

- `POST http://localhost:1337/<collection_type>` to create a new entries and returns its value

- `PUT http://localhost:1337/<collection_type>/<id>` to update an entry

- `DELETE http://localhost:1337/<collection_type>/<id>` to delete an entry

## API Parameters

[API Parameter doc](https://strapi.io/documentation/developer-docs/latest/developer-resources/content-api/content-api.html#api-parameters)

We can use additional parameters (the part after `?` in a URL) to perform some query (like filter, sort, limit, locale, etc)

For specific on how to use it, read the document above

## Overwrite the method

[Document on the customization](https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#routing)

We can customize the behavior of some method like `find` or `put`, or do something before saving into database, etc.

All of this overwrite is in the `/api` folder. Read the document for more information
