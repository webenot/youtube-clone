import fs from 'fs';
import passport from 'passport';

import routes from '../routes';
import User from '../models/User';

export const getJoin = (req, res) => {
  res.render('join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res, next) => {
  const { body: { name, email, password, password2 } } = req;
  if (password !== password2) {
    req.flash('error', 'Passwords don\'t match');
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
      res.status(403);
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
  successFlash: 'Welcome',
  failureFlash: 'Can\'t log in. Check email and/or password',
});

export const githubLogin = passport.authenticate('github', {
  scope: [ 'user:githubId' ],
  successFlash: 'Welcome',
  failureFlash: 'Can\'t log in',
});

export const githubAuthenticate = passport.authenticate('github', {
  failureRedirect: '/login',
  successFlash: 'Welcome',
  failureFlash: 'Can\'t log in',
});

export const githubLoginCallback = async (_, __, profile, done) => {
  const { _json: { id, avatar_url: avatarUrl, name, email } } = profile;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      try {
        user = await User.create({ githubId: id, avatarUrl, name, email });
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

export const fbLoginCallback = async (_, __, profile, done) => {
  const { _json: { id, name, email } } = profile;
  const avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
  try {
    let user = await User.findOne({ name });
    if (!user) {
      try {
        user = await User.create({ facebookId: id, name, email, avatarUrl });
        return done(null, user);
      } catch (e) {
        console.error(e);
        return done(e, null);
      }
    } else if (!user.facebookId) {
      user.facebookId = id;
      if (!user.name) {
        user.name = name;
      }
      if (!user.avatarUrl) {
        user.avatarUrl = avatarUrl;
      }
      user.save();
    }
    return done(null, user);
  } catch (e) {
    console.error(e);
    return done(e, null);
  }
};

export const fbLogin = passport.authenticate('facebook', {
  successFlash: 'Welcome',
  failureFlash: 'Can\'t log in at this time',
});

export const fbAuthenticate =
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    successFlash: 'Welcome',
    failureFlash: 'Can\'t log in at this time',
  });

export const postFbLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.flash('info', 'Logged out, see you later');
  req.logout();
  res.redirect(routes.home);
};

export const profile = async (req, res) => {
  if (req.user) {
    const user = await User.findById(req.user.id).populate('videos');
    res.render('userDetail', { pageTitle: 'User Detail', user });
  } else {
    res.redirect(routes.home);
  }
};

export const userDetail = async (req, res) => {
  const { params: { id } } = req;
  try {
    const user = await User.findById(id).populate('videos');
    res.render('userDetail', { pageTitle: 'User Detail', user });
  } catch (e) {
    console.error(e);
    req.flash('error', 'User not found');
    res.status(404);
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) => {
  res.render('editProfile', { pageTitle: 'Edit Profile' });
};

export const postEditProfile = async (req, res) => {
  const { user: { id }, body: { name, email }, file } = req;
  try {
    const user = await User.findById(id);
    if (user.name !== name) {
      user.name = name;
    }
    if (user.email !== email) {
      user.email = email;
    }
    if (file && file.path) {
      if (user.avatarUrl) {
        if (fs.existsSync(user.avatarUrl)) {
          fs.unlinkSync(user.avatarUrl);
        }
      }
      user.avatarUrl = file.path.replace(/\\/g, '/');
    }
    user.save();
    req.flash('success', 'Profile updated');
    res.redirect(routes.users + routes.profile);
  } catch (e) {
    console.error(e);
    req.flash('error', 'Can\'t update profile');
    res.status(403);
    res.render('editProfile', { pageTitle: 'Edit Profile' });
  }
};

export const getChangePassword = (req, res) => {
  res.render('changePassword', { pageTitle: 'Change Password' });
};
export const postChangePassword = async (req, res) => {
  const { body: { oldPassword, password, password2 } } = req;
  if (password !== password2) {
    req.flash('error', 'Passwords don\'t match');
    res.status(406);
    res.render('changePassword', { pageTitle: 'Change Password' });
  } else {
    try {
      await req.user.changePassword(oldPassword, password);
      req.flash('success', 'Password updated successfully');
      res.redirect(routes.users + routes.profile);
    } catch (e) {
      console.error(e);
      req.flash('error', 'Can\'t change password');
      res.status(403);
      res.render('changePassword', { pageTitle: 'Change Password' });
    }
  }
};
