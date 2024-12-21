const base_url = '/api/';
export const endpoint = {
  auth: {
    signup: base_url + 'auth/signup',
    login: base_url + 'auth/login',
    userinfo: base_url + 'auth/userinfo',
    recover_password: base_url + 'auth/recover-password'
  },
  admin: {
    users: base_url + 'admin/users',
    user_active: base_url + 'admin/user_active'
  }
};