// if there is a token in the local storage, it means the user is connected and verify it
export default function isConnected() {
  return !!localStorage.getItem("token");
}
