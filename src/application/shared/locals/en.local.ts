import { plurals, strings,  } from "./keys"

export default {
  [strings.USER_CREATED]: "User created and registered",
  [strings.LOGIN_SUCESSFUL]: "Login sucessful",
  [strings.USER_ALREADY_LOGGED_IN]: "New access token generated",
  [strings.USER_DISCONNECTED]: "User logged out",
  [strings.SOMETHING_WAS_WRONG]: "Could not complete the operation. Try again later",
  [strings.EMAIL_PASSWORD_INVALID]: "Email or password incorrect",
  [strings.INVALID_PASSWORD]: "The password must contain least at one upper case letter, one lower case letter, one digit and a length of least at 8 characters",
  [strings.USER_ALREADY_EXISTS]: "User already exists",
  [strings.UNAUTHORIZED]: "Unauthorized",
  [strings.PAGE_NOT_FOUND]: "Page not found. Verify the request method and the path, and try again.",
  [strings.NEED_AUTHENTICATION]: "Need Authentication",
  [strings.SUCCESSFUL_OPERATION]: "Successful operation",
  [strings.EMPTY_LIST]: "Empty List",
  [strings.USER_NOT_FOUND]: "User not found",
  
  [plurals.MISSING_ATRIBUTES]: "Missing attributes: %$s",
  [plurals.INVALID_ATTRIBUTES]: "Invalid attributes: %$s",
  [plurals.LINK_ALREADY_EXISTS]: "There's already a link with this path: %$s",
  [plurals.SERVICE_ONLINE]: "Service online at %$s with remote request status %$s"
}