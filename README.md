<h1 style="text-align: center; margin-bottom: -10px; font-size: 30px;"><strong>Single Sign On</strong></h1>

---

<div id="top"></div>

<details>
  <summary style="font-size: 25px"><strong>Table of Contents</strong></summary>
  <ol>
    <li>
      <a href="#about-the-project">About the project</a>
      <ul>
        <li><a href="#description">Description</a></li>
        <li><a href="#used-technologies">Used technologies</a></li>
      </ul>
    </li>
    <li>
      <a href="#setup">Setup</a>
      <ul>
        <li><a href="#for-development">For development</a></li>
      </ul>
    </li>
    <li>
      <a href="#commands">Commands</a>
    </li>
    <li>
      <a href="#debug-in-vs-code">Debug in VS Code</a>
    </li>
    <li><a href="#stay-in-touch">Stay in touch</a></li>
  </ol>
</details>

---

## __About the project__

### __Description__

API for single sign-on across multiple apps.

API Definition for Postman: [SSO_API.postman_collection.json](/docs/SSO_API.postman_collection.json)

<p align="right">(<a href="#top">Back to top</a>)</p>

### __Used technologies__

- [Node.js v20.16.0](https://nodejs.org/es/)
- [NestJs](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [Docker](https://www.docker.com/)

<p align="right">(<a href="#top">Back to top</a>)</p>

## __Setup__

### __For development__
- Create .env file from .env.example and populate with corresponding values
- Have Docker installed and running
- Have Nest CLI installed: `npm i -g @nestjs/cli`
- Install dependencies: `yarn install`
- Build database: `docker-compose up -d`
- Run migrations: `yarn migration:run`
- Run seed: `GET: http://localhost:4000/api/v1/seed`

## Commands
- Run app: 
  - Development: `yarn start`
  - Watch mode: `yarn start:dev`
  - Debug mode: `yarn start:debug`
  - Production mode: `yarn start:prod`
- Run tests: 
  - Unit tests: `yarn test`
  - e2e tests: `yarn test:e2e`
  - Test coverage: `yarn test:cov`
- Migrations:
  - Create a new migration: `yarn migration:create src/core/database/migrations/{name}`
  - Generate a migration from existing table schema: `yarn migration:generate src/core/database/migrations/{name}`
  - Run all pending migrations: `yarn migration:run`
  - Revert the most recent migration: `yarn migration:revert`
  - Show migrations: `yarn migration:show`

<p align="right">(<a href="#top">Back to top</a>)</p>

## Debug in VS Code
Run application with `yarn start:debug` and attach debugger as indicated in the image below
![Attach debugger](/docs/images/attach-debugger.png)

It is important to have the `.vscode/launch.json` file configured as follows
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach",
            "port": 9229,
            "request": "attach",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "type": "node"
        }
    ]
}
```
If everything went well, we can see that the color of the VS Code status bar changed to orange and in the console we will see a message that the debugger was attached.

![Result of attach debugger](/docs/images/result-of-attach-debugger.png)

<p align="right">(<a href="#top">Back to top</a>)</p>

### __Stay in touch__

- Author - [Braian Gonzales](https://braiangonzales.vercel.app/)
- Email - [braian.gonzales77@gmail.com](mailto:braian.gonzales77@gmail.com)
- LinkedIn - [in/braiangonzales/](https://www.linkedin.com/in/braiangonzales/)

<p align="right">(<a href="#top">Back to top</a>)</p>
