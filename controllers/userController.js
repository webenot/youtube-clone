import routes from '../routes';
import User from '../models/User';

export const getJoin = (req, res) => {
  res.render('join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res) => {
  console.log(req.body);
  const { body: { name, email, password, password2 } } = req;
  if (password !== password2) {
    res.status(406);
    res.render('join', { pageTitle: 'Join' });
  } else {
    try {
      const user = await User({ name, email });
      User.register(user, password);
      // @todo Log user in
      res.redirect(routes.home);
    } catch (e) {
      console.error(e);
      res.render('join', { pageTitle: 'Join' });
    }
  }
};

export const getLogin = (req, res) => {
  res.render('login', { pageTitle: 'Log In' });
};

export const postLogin = (req, res) => {
  console.log(req.body);
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  // @todo Process logout
  res.redirect(routes.home);
};

export const userDetail = (req, res) => res.render('userDetail', { pageTitle: 'User Detail' });
export const editProfile = (req, res) => res.render('editProfile', { pageTitle: 'Edit Profile' });
export const changePassword =
  (req, res) => res.render('changePassword', { pageTitle: 'Change Password' });
