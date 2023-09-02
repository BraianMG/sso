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
    <li><a href="#stay-in-touch">Stay in touch</a></li>
  </ol>
</details>

---

## __About the project__

### __Description__

API for single sign-on across multiple apps

<p align="right">(<a href="#top">Back to top</a>)</p>

### __Used technologies__

- [Node.js v18.16.0](https://nodejs.org/es/)
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
- Run the app: 
  - Development: `yarn start`
  - Watch mode: `yarn start:dev`
  - Production mode: `yarn start:prod`
- Run tests: 
  - Unit tests: `yarn test`
  - e2e tests: `yarn test:e2e`
  - Test coverage: `yarn test:cov`

<p align="right">(<a href="#top">Back to top</a>)</p>

### __Stay in touch__

- Author - [Braian Gonzales](https://braiangonzales.vercel.app/)
- Email - [braian.gonzales77@gmail.com](mailto:braian.gonzales77@gmail.com)
- LinkedIn - [in/braiangonzales/](https://www.linkedin.com/in/braiangonzales/)

<p align="right">(<a href="#top">Back to top</a>)</p>
