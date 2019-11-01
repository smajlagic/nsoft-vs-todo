# nsoft-vs-todo

As my first [Vue.js](https://vuejs.org/) and second experience with modern development tools such as [Node.js](https://nodejs.org/). This is the journey of an experienced, so-called "senior" developer, building out a Todobox app as responsive single page web application. 

### Short description
Todobox is limited to two lists _To do_ and _Done_. Once an To do item checked, it's moved to Done list and vice versa. Items are moveable through lists via Drag & Drop feature (note: it require a bit longer click delay).
Each To do item have editable content with feature to upload an single image also remove it, in order to replace. Done items are not editable, but they can be moved back to To do list where become editable again. All items have option to remove but only Done list have option to delete all of them.
There is very basic and simple HTTP Authentication system and password is shown when clicked on _Forget your password?_ link on login screen.

Just in case here it is:
email: nsoft@todo
password: vahid

This app uses [localStorage](https://en.wikipedia.org/wiki/Web_storage#Local_and_session_storage) to keep all data inside browser.


## Demo

[Online demo](https://todo.radionica.digital/)
Note: No data is stored by server.

## Quick start

Make sure you have __Git__ and __Node__ installed on your system.

Clone project
```shell
git clone https://github.com/smajlagic/nsoft-vs-todo 
```
Project setup
```shell
npm install
```
Compiles and hot-reloads for development
```shell
npm run serve
```

## Developing

## Built With
> Node - v10.16.3
> Vue CLI - 4.0.5

### Prerequisites

Front-end environment dependencies
> vue - 2.6.10
> vue-smooth-dnd - 0.8.0
> vue-router - 3.1.3

Development environment dependencies
> @vue/cli-plugin-router - 4.0.0
> @vue/cli-service - 4.0.0
> vue-template-compiler - 2.6.10
> node-sass - 4.13.0
> sass - 1.23.1
> sass-loader - 8.0.0

### Addition configuration
See Vue CLI [Configuration Reference](https://cli.vuejs.org/config/).
