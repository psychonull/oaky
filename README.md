## How to

**[NodeJS](http://nodejs.org/) v0.8.x is required**

## Install Dependencies

```bash
npm install
```

## Compile the project

Run the following command at root of project

### Compile dist/oaky.js

```bash
grunt
```

### Compile dist/oaky.min.js

```bash
grunt dist
```

### Run Tests

```bash
grunt test
```

### FileSystem Watcher

To set a watcher, so you wont need to be running ```grunt``` every time a change is made, run:

**Only compile oaky.js**

```bash
grunt w
```

**Compile oaky.js and run tests**

```bash
grunt t
```

