export class URLConstants {
  static Users = {
    Refresh: { method: "get", path: "/v1/users/refresh" },
    SignUp: { method: "post", path: "/v1/users/signup" },
    SignIn: { method: "post", path: "/v1/users/signin" },
    Get: { method: "get", path: "/v1/users/get" }
  }

  static Health = { Ping: { method: "get", path: "/ping" } }
}