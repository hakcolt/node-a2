## Introduction

**Node Advanced API** is a **Clean Architecture** based **OOP Template Project** for **NodeJs** using **TypeScript** to implement with any user interface.

## About Clean Architecture

- The clean architecture allows us to develop the **use cases** and the **domain** (business logic) of an application without worrying about the type of database, web server framework, protocols, services, providers, among other things that can be trivial.

- The clean architecture, the hexagonal architecture, the onion architecture and the ports and adapters architecture in the background can be the same, the final purpose is to decouple the **business layer** of our application from the **outside world**, basically it leads us to think about designing our solutions from the **inside to outside** and **not** from the **outside to inside**.

- The advantages that clean architecture offers us are very significant; it is one of the **best practices for making scalable software** that **works for your business** and **not for your preferred framework**.

- Clean architecture is basically based on the famous and well-known five **SOLID principles** that we will internalize.

The main philosophy of **Node A2** is that your solution (**domain** and **application**, **“business logic”**) should be independent of the framework you use, therefore your code should **NOT BE COUPLED** to a specific framework or library, it should work in any framework.

**Node A2** has the minimum **tools** necessary for you to develop the **business logic** of your back-end application.

## Included Tools

**Node A2** includes some tools in the **src/application/shared** path which are described below:

### Locals

It is a **internationalization** tool that will allow you to manage and administer the local messages of your application, even with enriched messages.

We should create a Resource class with your values:

```typescript
const keys = {
  SOMETHING_WAS_WRONG: "SOMETHING_WAS_WRONG",
  MISSING_ATTRIBUTES: "MISSING_ATTRIBUTES",
  ONLY_ENGLISH: "ONLY_ENGLISH"
}

enum LocaleType {
  EN = "en",
  PT_BR = "pt-br"
}

const locals = {
  [LocaleType.EN]: {
    [keys.SOMETHING_WAS_WRONG]: "Unknown Error",
    [keys.MISSING_ATTRIBUTES]: "Missing Attributes: %$s",
    [keys.ONLY_ENGLISH]: "This resource is not defined in another language"
  },
  [LocaleType.PT_BR]: {
    [keys.SOMETHING_WAS_WRONG]: "Erro desconhecido",
    [keys.MISSING_ATTRIBUTES]: "Atributos que falta: %$s. Feito por %$s"
  }
}

const resources = new Resources(locals, Object.values(keys), LocaleType.EN)
```

For use it in any user case, you should do something like:

```typescript
console.log(resources.get(keys.SOMETHING_WAS_WRONG)) // Unknown Error

console.log(resources.getWithParams(keys.MISSING_ATTRIBUTES, "name: string, age: number", "Igor Hakcolt")) // Missing Attributes: name: string, age: number

console.log(resources.get(keys.ONLY_ENGLISH)) // This resource is not defined in another language

resources.language = LocaleType.PT_BR

console.log(resources.get(keys.SOMETHING_WAS_WRONG)) // Erro desconhecido

console.log(resources.getWithParams(keys.MISSING_ATTRIBUTES, "name: string, age: number", "Igor Hakcolt")) // Atributos que faltam: name: string, age: number por Igor Hakcolt

console.log(resources.get(keys.ONLY_ENGLISH)) // This resource is not defined in another language
```

This tool is now available as an **GitHub Package**.

### Errors 

Is a tool for separating **controlled** from **uncontrolled errors** and allows you to launch application errors according to your business rules, example:

It is important to note that the name of the context is concatenated with the name of the ApplicationError class in order to better identify the controlled errors.

The straightforward way to use it is as follows:

```typescript
throw new ApplicationError(
  resources.get(resourceKeys.PROCESSING_DATA_CLIENT_ERROR),
  error.code || applicationStatusCode.BAD_REQUEST_ERROR,
  JSON.stringify(error) // Optional
)
```

> Uncaught Errors will returns status 500 as result of the request and the error handler will print the error to the console.

### Result

**Result** is a **tool** that helps us control the flow of our **use cases** and allows us to **manage the response**, be it an **object**, an **array** of objects, a **message** or an **error** as follows:

```typescript
export class GetProductUseCase extends BaseUseCase {
  constructor(
    resources: Resources,
    private readonly healthProvider: IHealthProvider,
    private readonly productQueryService: IProductQueryService,
  ) {
    super(resources);
  }

  async execute(idMask: string): Promise<IResult<ProductDto>> {
    // We create the instance of our type of result at the beginning of the use case.
    const result = new Result<ProductDto>();
    // With the resulting object we can control validations within other functions.
    if (!this.validator.isValidEntry(result, { productMaskId: idMask })) {
      return result;
    }
    const product: Product = await this.productQueryService.getByMaskId(idMask);
    if (!product) {
      // The result object helps us with the error response and the code.
      result.setError(
        this.resources.get(resourceKeys.PRODUCT_DOES_NOT_EXIST),
        applicationStatusCodes.NOT_FOUND,
      );
      return result;
    }
    const productDto = ProductDto.fromJSON(product)
    // The result object also helps you with the response data.
    result.setData(productDto, this.applicationStatusCodes.SUCCESS);
    // And finally you give it back.
    return result;
  }
}
```

The **Result** object may or may not have a **type** of **response**, it fits your needs, and the **Result instance without type** cannot be assigned **data**.

```typescript
const resultWithType = new Result<ProductDto>();
// or
const resultWithoutType = new Result();
```

For clean code you can return validation result and handles the error clean way through **Result** visitor pattern method like:

```typescript
async execute(args: ActionDto): Promise<IResult> {
  const result = new Result();

  if (!this.isValidRequest(result, args)) return result;

  /*...*/

  return result;
}
```

The **Result** object can help you in unit tests as shown below:

```typescript
it("should return a 400 error if quantity is null or zero", async () => {
  itemDto.quantity = null;
  const result = await addUseCase.execute({ userUid, itemDto });
  expect(result.success).toBeFalsy();
  expect(result.error).toBe(
    resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, "quantity: string"),
  );
  expect(result.statusCode).toBe(resultCodes.BAD_REQUEST);
});
```

This tool is now available as an **NPM package**.

### Validator

The **validator** is a **dynamic tool** and with it you will be able to **validate any type of object and/or parameters** that your use case **requires as input**, in addition to also being able to **validate email, passwords and so on**.

```typescript
/*...*/
  const missingAttributes = validation.validateObject(this, ["firstName:string", "lastName:string", "email:string", "gender:string", "password:string"])

  if (missingAttributes.length) {
    result.setError(resources.getWithParams(plurals.MISSING_ATRIBUTES, validation.formatMissingAttributes(missingAttributes)), 400)
    return false
    }

  if (!validation.validatePassword(this.password)) {
    result.setError(resources.get(strings.INVALID_PASSWORD), 400)
    return false
  }

  const genders = Object.values(Gender)
  if (!genders.includes(this.gender as Gender)) {
    result.setError(resources.get(strings.INVALID_GENDER), 400)
    return false
  }

  if (!validation.validateEmail(this.email)) {
    result.setError(resources.get(strings.INVALID_EMAIL), 400)
    return false
  }

  return true
/*...*/
```

This tool is now available as an **Github Package**.

## How To Use

In this **template** is included the example code base for **ExpressJs**, but if you have a **web framework of your preference** you must configure those according to the framework.

Clone this repo or use it as template, and then, continue with the **installation** step described in this guide.

### Controllers

The location of the **controllers** must be in the **adapters** directory, there you can place them by responsibility in separate directories.

The controllers should be **exported as default** modules to make the handling of these in the index file of our application easier.

Example of the handling of the **controllers** in the **index** file of our application:

```typescript
/*...*/
// Region controllers
import shoppingCarController from "./adapters/controllers/shoppingCart/ShoppingCar.controller";
import categoryController from "./adapters/controllers/category/CategoryController";
import productController from "./adapters/controllers/product/Product.controller";
/*...*/
// End controllers

const controllers: BaseController[] = [
  productController,
  shoppingCarController,
  categoryController,
  /*...*/
];

const appWrapper = new AppWrapper(controllers);
/*...*/
```

### Routes

The strategy is to manage the routes **within** the **controller**, this allows us a **better management** of these, in addition to a greater capacity for **maintenance** and **control** according to the **responsibilities** of the controller.

```typescript
/*...*/
initializeRoutes(router: Router): void {
  router.post("v1/cars", authorization(), this.create);
  router.get("v1/cars/:idMask", authorization(), this.get);
  router.post("v1/cars/:idMask", authorization(), this.buy);
  router.post("v1/cars/:idMask/items", authorization(), this.add);
  router.put("v1/cars/:idMask/items", authorization(), this.remove);
  router.delete("v1/cars/:idMask", authorization(), this.empty);
  /*...*/
}
/*...*/
```

## Using with another web server framework

You must implement the configuration made with **ExpressJs** with the framework of your choice and **install** all the **dependencies** and **devDependencies** for your framework, You must also modify the **Server** module, **Middleware** in **infrastructure** directory and the **BaseController** and **Controllers** in adapters directory.

And then, continue with the step **installation**.

## UseCase

Os casos de uso devem estar em application/modules e devem retornar um objeto Result. Em seguida, deve-se importa-los para serem usados nos controllers, como no exemplo a seguir:

The **Use Cases** must be in **application/modules** and must return a **Result** object.  Once ready for use, we must import them to **controllers** passing the **contracts** as constructor's parameters, as in the following example:

```typescript
export class UserController extends BaseController {
  signUp = async (request: Request, res: Response, next: NextFunction) => {
    const req = request as IRequest
  
    const resources = req.resources
    const repository = new LocalUserRepository()
    const authProvider = new AuthProvider()
  
    const registerService = new RegisterUserUseCase(resources, repository, authProvider)
    const user = req.body
  
    this.handleResult(res, next, registerService.execute(user))
  }
  
  override initializeRoutes(router: Router) {
    router.post("v1/users/signup", this.signUp)
  }
}
```

## Infrastructure

In this layer you can add the connections services of all external services, your db models, and other services.

The infrastructure includes in the application level a class strategy **Result** that act as a standardized response model.

## Installation

Depending on your need you have two options, **local** and with **docker compose**, but first of all we need to set up the **.env file**:

Go to project root directory, create a **.env file** and inside it copy and paste this content:

```text
NODE_ENV=development
SERVER_ROOT=/api
SERVER_HOST=localhost
SERVER_PORT=3000
ORIGINS="http://localhost:3100,http://localhost:3200"
JWT_LONG_SESSION_KEY=defineYourKey
JWT_LONG_SESSION_TIME_IN_SECONDS=604800 # 7 DAYS IN SECONDS
JWT_REFRESH_SESSION_KEY=defineOtherKey
JWT_REFRESH_SESSION_TIME_IN_SECONDS=21600 # 6 HOURS IN SECONDS
```

### Local

First, we must install the dependencies, run: 

```shell
npm install
```

Second, we must update the dependencies, run: 

```shell
npm update
```

Third, run project in hot reload mode (Without debug, for it go to [Debug instructions](#application-debugger))

```shell
npm run dev
```

or 

```shell
npm run build
node dist/index
```

### Docker Compose

The first two steps are for updating the project, but you can skip to step 3 if you prefer.

First, we must install the dependencies, run: 

```shell
npm install
```

Second, we must update the dependencies, run: 

```shell
npm update
```

Third, build the app with the following command:

```shell
docker-compose up -d --build
```

## Run Test

- The end to end tests are implemented for each use case in its respective folder. 
- Ideally, each use case of your application should be supported by its respective test.
- The tests use the **Vitest**, which work like **Jest** but is much faster and can be run in two ways:

```shell
npm t
```

or 

```shell
npm run test
```


## Application debugger

If you are using VS Code the easiest way to debug the solution is to follow these instructions:

### The short way is the next:

Press **Ctrl + J** keys and later **click in down arrow** to add other terminal and select **JavaScript Debug Terminal** and later 

```console
$ npm run dev
```

### The complicated way is:

First go to **package.json** file.

Second, into package.json file locate the **debug** command just above the **scripts** section and click on it.

Third, choose the **dev script** when the execution options appear.

So, wait a moment and then you will see something like this on the console.

```console
$ npm run dev
Debugger attached.

> node-a2@1.0.0 dev
> ts-node-dev --respawn --transpile-only src/index.ts
Debugger attached.

[INFO] 11:36:45 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.1, typescript ver. 4.9.4)
Debugger attached.
Running in dev mode
Serve Running on localhost:3000/api
```

To stop the debug just press **Ctrl C** and close the console that was opened to run the debug script.

This method will allow you to develop and have the solution be attentive to your changes (hot reload) without the need to restart the service, VS Code does it for you automatically.


## Build for production

To get the code you can use in a productive environment run:

```console
npm run build
```

The result code will be stored in the **dist** directory.

You can also add your **scripts** in the **package.json** file and use them with your deployment strategies, even with **docker**.

To be able to **debug**, the system generates **javascript map files** in the **dist** directory, but this is only for testing purposes. When the **build** command runs, everything inside the **dist** directory is removed and only the **necessary code** is generated.

```console
tsc
```

With the previous command you can also generate the code of the **dist** directory but this command is configured in the **TS config file** to generate the **map files** needed by the application to perform the **debugging** process.


## Test your Clean Architecture

Something important is to know if we really did the job of building our clean architecture well, and this can be found very easily by following these steps: 

1. Make sure you don't have any pending changes in your application to upload to your repository, otherwise upload them if you do.

2. Identify and remove **adapters** and **infrastructure** **directories** from your solution, as well as the **index.ts** file.

3. Execute the test command **npm t** or **npm run test** and the build command **tsc** or **npm run build** too, and everything should run smoothly, otherwise you violated the principle of dependency inversion or due to bad practice, application layers were coupled that should not be coupled.

4. Run the **git checkout .** command to get everything back to normal.

5. Most importantly, no **domain entity** can make use of an **application service** and less of a **provider service** (repository or provider), the **application services use the entities**, the flow goes from the **most external part** of the application **to the most internal part** of it.

## Coupling

For the purpose of giving clarity to the following statement we will define **coupling** as the action of dependence, that is to say that **X depends on Y to function**.

Coupling is not bad if it is well managed, but in a software solution **there should not be coupling** of the **domain and application layers with any other**, but there can be coupling of the infrastructure layer or the adapters layer with the application and/or domain layer, or coupling of the infrastructure layer with the adapters layer and vice-versa*, but avoid the latter whenever possible*.

The clean architecture is very clear in its rules and dictates that the adapter layer cannot depend on the infrastructure layer, but in practice in certain languages like JavaScript (TypeScript) it is quite complicated to achieve this without the use of Dependency Inversion libraries like TypeDi or another one, however in practice having this type of coupling does not represent a major problem over time and I say this from experience.

## Strict mode

TypeScript's strict mode is quite useful because it helps you maintain the type safety of your application making the development stage of your solution more controlled and thus avoiding the possible errors that not having this option enabled can bring.

This option is enabled by default in NodeTskeleton and is managed in the **tsconfig.json** file of your solution, but if you are testing and don't want to have headaches you can disable it.

```json
  "strict": true,
```

## Conclusions

- When we develop with clean architecture we can more **easily change** any **"external dependency"** of our application without major concerns, obviously there are some that will require more effort than others, for example migrating from a NoSql schema to a SQL schema where probably the queries will be affected, however our business logic can remain intact and work for both models.

- The application during the development will tell us what could be the best choices for the infrastructure and adapters of our application.

- If you liked it and you learned something, give me my star in the project that is the way you can thank me, don't be a damn selfish person who doesn't recognize the effort of others.


## Warning

-  **Use this resource at your own risk.**

- **You are welcome to contribute to this project, dare to do so.**

- **Several concepts of this project were based on nodeTskeleton project.**

- **If you are interested you can contact me by this means.**

- 📫 <a href="mailto:hakcolt@gmail.com" target="_blank" >Write to him</a>

**[⬆ back to the past](#introduction)**


## Future tasks

- Docker implementation

<div style="display: flex; align-items: center; gap: 8px; margin-left: 8px;">
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16">
  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
</svg>
<a href="https://linkedin.com/in/hakcolt">My LinkedIn</a>
</div>

