<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start
```


## About Project

A quiz game made using websockets for realtime sending of data and answer submission


## Technologies used

## Nest Js Framework

- A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- Gives you true flexibility by allowing use of any other libraries.
- Provides Modular Architecture.
- It is helpful in implelmenting design patterns in javascript easily.

### Nodejs/Express

- Node Js is a javascript runtime coupled with ExpressJs framework it allows and helps in creating higly scalable servers easily.

### Mongo DB

- MongoDb is a NoSql database used to build highly available and scalable internet applications.
- Schema Design is flexible

### Mongoose Framework

Mongoose is a Node. js-based Object Data Modeling (ODM) library for MongoDB.

### TypeScript

- Typescript is strongly typed programming language build over javascript.
- It's used to provide typecheck and type errors.

### Module API's
```bash
User Module

@Post('BASE_URL/users/register'): Register a new user
@Get('BASE_URL/users/login'): Login an existing user
```

```bash
Game Module 

@Post('BASE_URL/game/start'): Start a game by returning a roomId
```

## Key points

1. Design a modular based architecture.
2. Design a simple efficinet schema in mongoose
3. Version Control of Api is handled properly
4. Guards are used for auhentication and authorization of API's.
5. Common Response Interceptor
6. Global Error Handler Middleware
7. Winston logger has been integrated for logging purpose.
8. Clean code architecture.

## Application takeaways
- Authentication is Done using JWT
- There are 3 API's, Register a user, Login a user, and to start a Game which returns a game roomId a user can join.
- There are rooms created for 2 users to play a quiz.
- Due to time constraints, I'm using data structures locally, can use Redis for more persistance.
- Have tested the API's using Postman.
- Deployed the app on Render for public access of API's (https://game-auth.onrender.com)

## Postman Collection Urls
 ```bash
   Socket collection: https://go.postman.co/workspace/New-Team-Workspace~8a3c749c-c144-42c2-b76b-6cd886489fc4/collection/6620807ab6799acf3a20d43d

  API's collection: 
   ```



