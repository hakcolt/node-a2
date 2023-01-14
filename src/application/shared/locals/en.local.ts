import { plurals, strings,  } from "./keys"

export default {
  [strings.USER_CREATED]: "User created, go to POST /login to get the access token",
  [strings.LOGIN_SUCESSFUL]: "Login sucessful. Use GET /login to refresh the access token when it expires (no authentication required)",
  [strings.USER_ALREADY_LOGGED_IN]: "New access token generated. Use GET /logout if you want to log out",
  [strings.USER_DISCONNECTED]: "User logged out",
  [strings.SOMETHING_WAS_WRONG]: "Could not complete the operation. Try again later",
  [strings.EMAIL_PASSWORD_INVALID]: "Email or password incorrect",
  [strings.INVALID_EMAIL]: "Email invalid property value",
  [strings.INVALID_PASSWORD]: "The password must contain least at one upper case letter, one lower case letter, one digit and a length of least at 8 characters",
  [strings.INVALID_GENDER]: "Email invalid gender value",
  [strings.USER_ALREADY_EXISTS]: "User already exists",
  [strings.NO_USER_LOGGED_IN]: "No user logged in",
  [strings.UNAUTHORIZED]: "Unauthorized",
  [strings.PAGE_NOT_FOUND]: "Page not found. Verify the request method and the path, and try again.",
  [strings.NEED_AUTHENTICATION]: "Need Authentication. Go to POST /login",

  [plurals.MISSING_ATRIBUTES]: "Missing attributes: %$s"
}