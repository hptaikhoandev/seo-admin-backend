# I. How to run up project in local environment step by step:
### Step 1: run docker environment
##### if MacOS platform:
    make run
##### if WindowOS platform:
    docker build -t seo-admin-backend . && docker-compose up -d
### Step 2: stop app container in Docker Desktop
    docker stop <id_container>
### Step 3: start app in local 
    npm run start
# II. Output
### Api healthCheck:
    http://localhost/api/health-check/
### Api manage MySQL database (PhpMyAdmin):
    user/password (root/drowssapAmin)
    http://localhost:8080/index.php?route=/

### Swagger api document:
    http://localhost/api-docs/
# III. Migration database
### create a migrate file:
    Command: npx sequelize-cli migration:generate --name <table_name>
    Example: npx sequelize-cli migration:generate --name infor-users
### create a model file:
    Command: npx sequelize-cli model:generate --name <model_name> --attributes <field_name:style, ...>
    Example: npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string
### run migrations:
    Command: npx sequelize-cli db:migrate
    Example: npx sequelize-cli db:migrate --env development 
    Example: npx sequelize-cli db:migrate --env production
### run rollback migrations: 
    Command: npx sequelize-cli db:migrate:undo --env {{env}}
### run rollback all migrations: 
    Command: npx sequelize-cli db:migrate:undo:all --env {{env}}