# Pitik Fastify

node.js backend project skeleton with fastify

## Prerequisites

Please have this software/package installed on your system (a.k.a globally)

- Node.js >= v14 (tested on v14 only)
- TypeScript >= v4
- ESLint >= v7

## How to use

1. download this template
   [here](https://gitlab.com/pitik.id/backend/project-skeletons/pitik-fastify/-/archive/master/pitik-fastify-master.zip)
2. extract the zip file and rename the folder to your liking
3. update your project information on `package.json`
4. rename `.env.example` to `.env`
5. Init your project folder as git folder
6. run `npm install --save`
7. run `npm run dev` to start developing, happy coding! 🎉

## Concepts

This skeletons is divided to several layers based on its general scope responsiblity. This
segregation of responsibility is intended for reusability on varied use cases, not endpoint-context
based.

Due to its nature of consisting from many layers, this skeleton implements dependency injection
(though not fully). By implementing dependency injection, each layer can be used _agnostically_
without needing to know how the upper layer is going to use it and on what use case it will be
utilized. Furthermore, each layer can be tested without fully requiring its dependencies.

The more common concepts such as how Fastify, TypeORM, or Bull works can be understood by reading
their official documentations.

And for team conventions, please refer to these documentation

- [Coding Standards](https://pitik.atlassian.net/wiki/spaces/ENG/pages/3211492/Coding+Standard)
- [Service Level Conventions](https://pitik.atlassian.net/wiki/spaces/ENG/pages/11698201/Service+Level+Conventions)
- [Standard Payload & Headers](https://pitik.atlassian.net/wiki/spaces/ENG/pages/11698179/Standard+Payload+Header)

## Project structure

### Summary

Basically, this skeleton can be used to create REST API and/or Web Worker. Architecture-wise, this
skeleton can implement service in REST, Event-Emitter, and PubSub.

Below are the explanations of each layers depending of its use case.

### Layers as API

Bottom up explanations of API, meaning the later layer will have dependency on previously explained
one. i.e **dao** is dependent to **datasources**.

#### **datasources**

This layers is directly related to data sources. Either it's database or third-party API, every data
should be modeled in here. Thus the upper layer will have full understanding of what it's gonna get
from the accessed source.

Folder of `entity` is where the data is modeled. This could be viewed as representation of a table
in database. This skeleton use TypeORM to communicate with multiple types of database. Read on
repository pattern of TypeORM to fully understand how this package is used here.

Folder of `connection` is where every connection to database is defined. To prevent memory leaks
from connection pool, the connection object is created _at max_ once and used everytime the source
is accessed.

#### **dao**

`dao` stands for _data access objects_, this is where logic of accessing data sources from one
entity resides. By depending to at least one entity, a DAO can access one specifiec data source and
do join and aggregate with other entities before providing data for service layer. To join and
aggregate from database, it is sugested to use methods provided by TypeORM as much as possible.

For example if we want to query from table `Task` and join with table `TaskDetail`, we will create
DAO class of `TaskDAO` and create dependency of connection to create a repository of Task entity.
Then we can use the repository object to access data by using methods provided by TypeORM.

#### **service**

This is where the business logics are implemented. By creating dependencies on multiple DAOs,
service layer can read and write data from multiple source, publish job to queue, or emitting event
for asynchronous task.

However there are several things that should not be done here

1. payload validation (should be on representation (API) layer)
2. role authentication (should be on _onRequest_ hook)
3. database direct query (should be on DAO layer)

#### **api**

API layer is closely related to client. This layer will process the income request payload and send
it to service layer, thus it depends of service layer only. Thanks to fastify we could do many
things before accepting and processing the request. take a look at snippet below

```javascript
@Controller('/performance')
export class PerformanceController {
  @Inject(PerformanceService)
  private service!: PerformanceService;

  @GET({
    url: '/projection',
    options: {
      schema: {
        querystring: performanceQueryDTO,
        response: {
          200: performanceProjectionDTO,
        },
      },
      onRequest: verifyToken,
    },
  })
  async getPerformanceProjection(request: PerformanceRequest) {
      ...

```

To create a API, we only need to create a class and attach a `@Controller()` decorator. We could
define the main path by passing it as argument to `@Controller()` decorator, that way we only need
to define a subpath on HTTP Method Decorator.

To create a new route, we need to create a class method inside Controller class. Attach at least one
HTTP Method decorator to a method, then we can define many things that route can do to process a
request. Observe the argument given to `@GET()` decorator above. We can define subpath, do
request/response payload validations, and assign preprocessing hooks. As probably you have noticed,
to decice what HTTP method for a route we can attach to different decorators such as `@POST()`,
`@PUT()`, `@PATCH()`, and `@DELETE()` to the class method.

#### **dto**

`dto` stands for _data transfer object_. This is probably not a real layer as it has no process in
it. Yet, DTO is very important to make sure data transfer in all use cases is properly defined. To
understand the concept of our DTO, read the documentation of TypeBox
[here](https://github.com/sinclairzx81/typebox).

By using TypeBox we could define a DTO and convert it to a static type. Static type is important to
extend fastify's `FastifyRequest` interface, thus we will have full understanding of what data the
request object will contain. The type can also be used to define what the class method and a service
layer method will return, doing that we prevent the response payload to differ from what we already
agreed with frontend engineers.

### Layers as Web Workers

[TBD]

#### jobs/queues

[TBD]

#### jobs/workers

[TBD]

### Event-Emitter

[TBD]

#### events/emitters

[TBD]

#### events/handlers

[TBD]

### Config & Libs

[TBD]

## Testing

All test files are stored in `__test__` folder. The `__test__` folder is fully reflecting the `src`
folder, including the filenames but with suffix of `*.test.ts` in order for test suite to recognize
it as test file.

### How to write test

[TBD]

### How to run test

Ensure that you already installed the package dependencies for this project

```
npm run test
```

[TBD]
