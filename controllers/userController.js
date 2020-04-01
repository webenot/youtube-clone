import passport from 'passport';

import routes from '../routes';
import User from '../models/User';

export const getJoin = (req, res) => {
  res.render('join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res, next) => {
  console.log('postJoin', req.body);
  const { body: { name, email, password, password2 } } = req;
  if (password !== password2) {
    res.status(406);
    res.render('join', { pageTitle: 'Join' });
  } else {
    try {
      const user = await User({ name, email });
      await User.register(user, password);
      req.body = { email, password };
      next();
    } catch (e) {
      console.error(e);
      res.render('join', { pageTitle: 'Join' });
    }
  }
};

export const getLogin = (req, res) => {
  res.render('login', { pageTitle: 'Log In' });
};

export const postLogin = passport.authenticate('local', {
  failureRedirect: routes.login,
  successRedirect: routes.home,
});

export const githubLogin = passport.authenticate('github', { scope: [ 'user:githubId' ] });

export const githubAuthenticate = passport.authenticate('github', { failureRedirect: '/login' });

export const githubLoginCallback = async (_, __, profile, done) => {
  const { _json: { id, avatar_url: avatarUrl, name, email } } = profile;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      try {
        user = await User.create({
          githubId: id,
          avatarUrl,
          name,
          email,
        });
        return done(null, user);
      } catch (e) {
        console.error(e);
        return done(e, null);
      }
    } else if (!user.githubId) {
      user.githubId = id;
      if (!user.avatarUrl) {
        user.avatarUrl = avatarUrl;
      }
      if (!user.name) {
        user.name = name;
      }
      user.save();
    }
    return done(null, user);
  } catch (e) {
    console.error(e);
    return done(e, null);
  }
};

export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

export const userDetail = (req, res) => res.render('userDetail', { pageTitle: 'User Detail' });
export const editProfile = (req, res) => res.render('editProfile', { pageTitle: 'Edit Profile' });
export const changePassword =
  (req, res) => res.render('changePassword', { pageTitle: 'Change Password' });
