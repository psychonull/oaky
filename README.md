## How to

**[NodeJS](http://nodejs.org/) v0.8.x is required**

## Install Dependencies

```bash
npm install
```

## Compile the project

Run the following command at root of project

### Develop Enviroment

```bash
grunt
```

### Stagging Enviroment

```bash
grunt stage
```

### Production Enviroment (Stagging and minified)

```bash
grunt prod
```

*these 3 commands will compile all the project and leave the compiled files ```/dist```*

### FileSystem Watcher

> Only for Develop Enviroment

To set a watcher, so you wont need to be running ```grunt``` every time a change is made, run:

```bash
grunt w
```

*So, everytime a file is saved inside ```/game``` it will run the compilation again*

