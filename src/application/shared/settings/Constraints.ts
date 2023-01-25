export class URLConstraint {
  static Users = {
    Refresh: { method: "get", path: "/v1/users/refresh" },
    SignUp: { method: "post", path: "/v1/users/signup" },
    SignIn: { method: "post", path: "/v1/users/signin" },
    Get: { method: "get", path: "/v1/users/get" }
  }

  static Links = {
    List: { method: "get", path: "/v1/links" },
    Create: { method: "post", path: "/v1/links" }
  }

  static Health = {
    Ping: { method: "get", path: "/v1/ping" }
  }

  static Root = {
    Redirect: { method: "get", path: "/:path" }
  }
}