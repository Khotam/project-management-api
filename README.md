# Project management api

## Tasks done
- Role based auth :white_check_mark:
- Organization CRUD :white_check_mark:
- OrganizationUser CRUD (create user for org, get org users, remove user from org) :white_check_mark:
- Project CRUD (tasks by project, user tasks by project) :white_check_mark:
- Task CRUD (assign user, assign dueDate, complete task) :white_check_mark:
- Statistics for admin :white_check_mark:

### Missing features
- Pagination, filtering, search and sorting (didn't have enough time and there were no strict requirements about it in the task description) :x: 
- knex.js is not used (lack of experience in knex.js) :x:
- Swagger is not configured well (lack of time) :x:

## Technologies used
- Nodejs
- Typescript
- Postgresql
- Nestjs
- Typeorm
- Postman
- docker-compose
- Git

## Steps to run application and test
1. `docker-compose up -d` to start postgresql locally 
2. put correct variables to `.env` file (there is example `.env-template`)
3. `npm install` to install dependencies
4. `npm run start:dev` to start application
5. import Postman collection and start testing
	- set jwtEmployee, jwtAdmin and managerToken variables to values that are from `/auth/login` endpoint

Done by: Bakhromov Khotam
Start date: 20.11.2023
Done at: 22.11.2023