'use strict';

const { validate } = use('Validator');

const Post = use('App/Models/Post');

class PostController {
  //Function to show all the posts
  async index({ view }) {
    //Retrieve all the posts
    const posts = await Post.all();

    //Render the posts/index view with the posts retrieved
    return view.render('posts.index', {
      title: 'Latest Posts',
      posts: posts.toJSON()
    });
  }

  //Function to show details on clicked post
  async details({ params, view }) {
    //Retrieve the data for the clicked post
    const post = await Post.find(params.id);

    //Render the posts/details view with the retrieved data
    return view.render('posts.details', {
      post: post
    });
  }

  //Function to show the Add Post view in posts/add
  async add({ view }) {
    return view.render('posts.add');
  }

  //Function to create a new post, linked to POST route from posts/add
  async create({ request, response, session }) {
    //Validate the input based on the given rules object
    const validation = await validate(request.all(), {
      title: 'required|min:3|max:255',
      body: 'required|min:3'
    });

    //If validation fails, send the user back to the same page, flashing the validation error messages
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();

      return response.redirect('back');
    }

    //Store the posted post data in the postData variable
    const postData = request.only(['title', 'body']);

    //Insert the record
    const post = await Post.create(postData);

    session.flash({ notification: 'Post added' });

    return response.redirect('/posts');
  }

  //Function to edit an existing post
  async edit({ params, view }) {
    //Retrieve the data for the post to be edited
    const post = await Post.find(params.id);

    //Render the view with the post data
    return view.render('posts.edit', {
      post: post
    });
  }

  //Function to update an existing record
  async update({ request, response, params, session }) {
    //Validate the input based on the given rules object
    const validation = await validate(request.all(), {
      title: 'required|min:3|max:255',
      body: 'required|min:3'
    });

    //If validation fails, send the user back to the same page, flashing the validation error messages
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();

      return response.redirect('back');
    }

    //Store the posted post data in the postData variable
    const postData = request.only(['title', 'body']);

    //Find the post record based on the id
    const post = await Post.find(params.id);

    //Update the record
    post.merge(postData);
    await post.save();

    session.flash({ notification: 'Post updated!' });

    return response.redirect('/posts');
  }

  //Function to delete an existing record
  async destroy({ params, session, response }) {
    //Find the post record based on the id
    const post = await Post.find(params.id);

    //Delete the record
    await post.delete();

    session.flash({ notification: 'Post deleted!' });

    return response.redirect('/posts');
  }
}

module.exports = PostController;
