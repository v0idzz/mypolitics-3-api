import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  recaptcha: process.env.RECAPTCHA_KEY,
  strategies: {
    facebook: {
      clientID: process.env.AUTH_FACEBOOK_APP_ID,
      clientSecret: process.env.AUTH_FACEBOOK_APP_SECRET,
      callbackURL: process.env.AUTH_FACEBOOK_CALLBACK,
    },
    google: {
      clientID: process.env.AUTH_GOOGLE_APP_ID,
      clientSecret: process.env.AUTH_GOOGLE_APP_SECRET,
      callbackURL: process.env.AUTH_GOOGLE_CALLBACK,
    }
  }
}));
