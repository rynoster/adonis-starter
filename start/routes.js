'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route');

Route.on('/').render('home');

/*
|--------------------------------------------------------------------------
| Posts Routes
|--------------------------------------------------------------------------
*/

Route.get('/posts', 'PostController.index');

Route.get('/posts/add', 'PostController.add');

Route.get('/posts/edit/:id', 'PostController.edit');

Route.get('/posts/:id', 'PostController.details');

Route.post('/posts', 'PostController.create');

Route.put('/posts/:id', 'PostController.update');

Route.delete('/posts/:id', 'PostController.destroy');

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/

Route.on('/login').render('login');

Route.get('/users/:id', 'UserController.show').middleware('auth');

Route.get('/logout', 'UserController.logout');

Route.post('/login', 'UserController.login');

Route.on('/signup').render('signup');

Route.post('/signup', 'UserController.signup');
