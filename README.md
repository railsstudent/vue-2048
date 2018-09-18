# vue-2048

## Problem Statement

This application is a 2048 game where player merges tiles together to create tile 2048 to win.

## Architecture

This project was generated with [Vue CLI](https://cli.vuejs.org/) version 3.0.1.

The game is composed of a Board component that designs game layout and board with FlexBox and CSS grid. The component adopts Single File Architecture (SFA) where source file encapsulates HTML template SCSS and JS logic.

## Technology Stack
* `Vue 2`  - JavaScript framework
* `SCSS`   - style all components in the application
* `JavaScript` - logic of board component is written in JavaScript and ES6
* `Jest` - write and test JavaScript test codes
* `Cypress` - execute e2e tests in browser
* `Eslint + Prettier` - lint JavaScript codes and format files

### Live Site
https://railsstudent.github.io/vue-2048/

### Github Repository
https://github.com/railsstudent/vue-2048/

### Software Requirements
- node 8.11.3
- vue-cli 3

### Development server

Install dependencies

 ```javascript
    # with npm
    npm install

    # or with yarn
    yarn install
```

Run `yarn serve` for a dev server. Navigate to `http://localhost:8080/`. The app will automatically reload if you change any of the source files.

### Build

Production build

 ```javascript
    # with npm
    npm run build

    # or with yarn
    yarn build
```

The build artifacts will be bundled in the `dist/` directory.

### Run your unit tests
```javascript
    # with npm
    npm run test:unit

    # or with yarn
    yarn test:unit
```

### Watch your unit tests
```javascript
    # with npm
    npm run test:unit:watch

    # or with yarn
    yarn test:unit:watch
```

### Run your end-to-end tests
```javascript
    # with npm
    npm run test:e2e

    # or with yarn
    yarn test:e2e
```

### View code coverage results
```javascript
    # with npm
    npm run static:coverage

    # or with yarn
    yarn static:coverage
```
Navigate to http://localhost:8888

### linting
```javascript
    # with npm
    npm run lint

    # or with yarn
    yarn lint
```

### SCSS linting
```javascript
    # with npm
    npm run lint:scss

    # or with yarn
    yarn lint:scss
```

### Deployment to Github page
 ```javascript
    # with npm
    npm run deploy

    # or with yarn
    yarn deploy
```
The command executes deploy.sh to push codes from dist/ to gh-pages branch

# Area of Improvements
1. This project is currently without e2e testing. Test cases will be implemented after grasping the concepts of Cypress.io
2. Store highest score in local storage of browser