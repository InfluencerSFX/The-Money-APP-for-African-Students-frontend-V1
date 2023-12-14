export function saveAccessToken(res) {
  localStorage.setItem("token", res.headers.get("x-access-token"));
}
