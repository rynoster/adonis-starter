'use strict';

const Mail = use('Mail');
const User = use('App/Models/User');

const { validate } = use('Validator');

//Define the validation rules for login and signup
const rulesSignup = {
  email: 'required|email|unique:users,email',
  password: 'required|min:4'
};

const rulesLogin = {
  email: 'required|email',
  password: 'required'
};

const validateMessages = {
  'email.required': 'Email address is required',
  email: 'Please input a valid email address',
  'email.unique': 'Email address already in use',
  'password.min': 'A miniumum of 4 characters is required for the password',
  'password.required': 'Password is required'
};

class UserController {
  //Function to log the user in
  async login({ request, auth, response, session }) {
    const validation = await validate(request.all(), rulesLogin, validateMessages);

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashExcept(['password']);

      return response.redirect('back');
    }

    //Attempt login with the supplied credentials
    const { email, password } = request.all();
    await auth.remember(true).attempt(email, password);

    return response.redirect('/');
  }

  //Function to show user profile details
  async show({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone else's profile";
    }
    return auth.user;
  }

  //Function to sign up the user, creates the user in database after validation
  async signup({ request, response, session }) {
    //First validate the input
    const validation = await validate(request.all(), rulesSignup, validateMessages);

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashExcept(['password']);

      return response.redirect('back');
    }

    //Create the user in the database
    const userData = request.except(['_csrf']);
    const user = await User.create(userData);

    //Send the welcome email
    await Mail.send('emails.welcome', user.toJSON(), message => {
      message
        .to(user.email)
        .from('some@email.com', 'Some person')
        .subject('Welcome to AdonisJs 4.0 starter site');
    });

    session.flash({ notification: 'Signed up successfully!' });

    return response.redirect('/');
  }

  //Function to log out the user
  async logout({ auth, response }) {
    await auth.logout();

    return response.redirect('/');
  }
}

module.exports = UserController;
