export class URLConstraint {
  static Users = {
    Refresh: { method: "get", address: "/v1/users/refresh" },
    SignUp: { method: "post", address: "/v1/users/signup" },
    SignIn: { method: "post", address: "/v1/users/signin" },
    Get: { method: "get", address: "/v1/users/get" }
  }
}