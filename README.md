# TP Backend -- Express, MongoDB, JWT, MVC

## Description

This project is a backend REST API built with **Node.js**, **Express**,
and **MongoDB**, implementing **JWT authentication** and following the
**MVC (Model--View--Controller)** architecture pattern.

It allows users to register, log in, and manage a protected entity
(**Tasks**) associated with the authenticated user.

------------------------------------------------------------------------

## Technologies

-   Node.js
-   Express
-   MongoDB + Mongoose
-   JWT (JSON Web Tokens)
-   bcrypt
-   Thunder Client (API testing)

------------------------------------------------------------------------

## Installation

1.  Clone the repository:

``` bash
git clone <repository-url>
```

2.  Install dependencies:

``` bash
npm install
```

3.  Create a `.env` file based on `.env.example`.

------------------------------------------------------------------------

## Environment Variables

``` env
PORT=3000
MONGO_URI=mongodb://localhost:27017/tp-backend
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

------------------------------------------------------------------------

## Run the Project

``` bash
npm run dev
```

The server will start on:

    http://localhost:3000

------------------------------------------------------------------------

## Authentication Endpoints

### Register

**POST** `/api/auth/register`

``` json
{
  "email": "user@test.com",
  "password": "123456"
}
```

### Login

**POST** `/api/auth/login`

``` json
{
  "email": "user@test.com",
  "password": "123456"
}
```

Response:

``` json
{
  "token": "JWT_TOKEN"
}
```

------------------------------------------------------------------------

## Protected Endpoints (Tasks)

All protected routes require the header:

    Authorization: Bearer JWT_TOKEN

### Get Tasks

**GET** `/api/tasks`

### Create Task

**POST** `/api/tasks`

``` json
{
  "title": "My first task"
}
```

### Update Task

**PATCH** `/api/tasks/:id`

``` json
{
  "title": "Updated task",
  "completed": true
}
```

### Delete Task

**DELETE** `/api/tasks/:id`

------------------------------------------------------------------------

## API Testing

All endpoints were tested using **Thunder Client**.\
The exported collection is included in the repository.

------------------------------------------------------------------------

## Author

Tomás Taboada