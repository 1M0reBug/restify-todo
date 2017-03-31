# Restify todo app

This project is an implementation of the famous [Todo MVC](http://todomvc.com)
application using [restify](http://restify.com) as backend server.

The frontend application is a really non performant thought version using only vanilla Javascript,
it relies on fetch and es6 (no polyfill, use a modern browser !).

The data storage is made using a a Store really similar to how [Redux](http://redux.js.org) behaves.

**Warning**: the server is heavily verbose.

## Scripts

Launch the server by using

```
$ yarn run serve
```

Launch the client by using (Unix based)

```
$ yarn run client
```

it will cd into the `client/` folder and launch a python server

```
$ python -m SimpleHTTPServer
```

## Todo 

**features**
- [x] Add a todo
- [x] Delete a todo
- [x] Complete a todo
- [x] Delete all completed todos
- [ ] Filter elements
- [ ] Improve performances

**tests**:

- [ ] add unit tests
- [ ] add blackbox/integration tests
- [ ] add e2e test
