# Northcoders News API

A RESTful API built for a news website, providing endpoints to fetch articles, topics, users, and comments.
It includes functionality for posting, updating, and deleting comments.
The backend is developed using Node.js, Express, and PostgreSQL.
It is deployed using Render and Supabase.

The API was created to provide a foundation for a full-stack web application and features CRUD functionality.

Instructions on how to create the environment variables for anyone who wishes to clone this project and run it locally:

Step 1: clone the repository

- git clone https://github.com/SO-1993/nc-news.git
- cd nc-news

Step 2: install relevant dependencies

- Node.js: (minimum v16.0.0+)
- PostgreSQL: (minimum v12.0.0+)

Step 3: set up environemnt files

- As the environent files (.env.\*) are not included in the repo (they are ignored when placed in .gitignore), you must create your own .env files to configure the environment vriables.
- To achieve this, refer to the steps below:
  1. create new file .env.development and paste the following: PGDATABASE=nc_news
  2. create new file .env.test and paste the following: PGDATABASE=nc_news_test
  3. check for the command '.env.\*' in .gitignore (if not present, paste it within)

Step 4: seed the local database

- After setting up the environment variables, you can seed your local PostgreSQL database with the provided data by running 'npm run seed'.
- This will populate the development database (nc_news) with articles, topics, users, and comments.

Step 5: run tests

- To ensure everything is working correctly, you can run the test suite: npm test.
- This will run all the Jest tests for the API, ensuring all functionality behaves as expected.

API Endpoints
Here are some of the main endpoints available in the API:

- GET /api/topics

  - responds with a list of topics

- GET /api
  -responds with a list of available endpoints

- GET /api/articles/:article_id
- responds with a single article by article_id

- GET /api/articles

  - responds with a list of articles

- GET /api/articles/:article_id/comments

  - responds with a list of comments by article_id

- POST /api/articles/:article_id/comments
  -add a comment by article_id

- PATCH /api/articles/:article_id

  - updates an article by article_id

- DELETE /api/comments/:comment_id

  - deletes a comment by comment_id

- GET /api/users

  - responds with a list of users

- GET /api/articles (queries)

  - allows articles to be filtered and sorted

- GET /api/articles/:article_id (comment count)
  - adds a comment count to the response when retrieving a single article

Deployment

This project is deployed using Render for hosting the API and Supabase for the PostgreSQL database. For deployment, ensure you have:

- DATABASE_URL set in your environment variables for connecting to the production database.
- NODE_ENV set to production for your deployment environment.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
