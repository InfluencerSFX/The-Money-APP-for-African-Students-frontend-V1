export function saveAccessToken(res) {
  if (res.headers.get("x-access-token"))
    localStorage.setItem("token", res.headers.get("x-access-token"));
}
