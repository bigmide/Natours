# Natours Application

An API rendered website built using modern technologies: node.js, express, mongoDB, mongoose.

Hosted on: https://natours-api-3tvo.onrender.com

## Features

- Sign Up
- Login
- Book Tours
- Update name, email, password and user photo
- Reset password

## REST API Endpoints

### GET

- Get all tours: `https://natours-api-3tvo.onrender.com/api/v1/tours`
- Get a tour: `https://natours-api-3tvo.onrender.com/api/v1/tours/:id`
- Get top 5 cheap tours: `https://natours-api-3tvo.onrender.com/api/v1/tours/top-5-cheap`
- Get monthly plans: `https://natours-api-3tvo.onrender.com/api/v1/tours/monthly-plan/2021`

### POST

- Sign up: `https://natours-api-3tvo.onrender.com/api/v1/users/signup`

  - The request body should contain the following field names, `name`, `email`, `password` and `passwordConfirm`

- Login: `https://natours-api-3tvo.onrender.com/api/v1/users/login`

  - The request should contain the `email` and `password` field names.

- Forgot password: `https://natours-api-3tvo.onrender.com/api/v1/users/forgot-password`
  - you must be login to access this route.
  - The request body should only contain the `email` field name.

### PATCH

- Update your details: `https://natours-api-3tvo.onrender.com/api/v1/users/update-me`
  - you must be login to access this route.
  - The request body should contain the following field names, `name` and `email`

### DELETE

- Delete Your account: `https://natours-api-3tvo.onrender.com/api/v1/users/delete-me`
