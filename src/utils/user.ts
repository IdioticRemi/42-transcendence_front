import { store } from "@/store";
import CONST from "@/utils/const";

async function sendBackendRequest(path: string, opts?: RequestInit) {
  const token = store.state.auth.token;

  opts = {
    headers: { Authorization: `Bearer ${token}` },
    ...opts,
  };
  const res = await fetch(CONST.BackendURL + path, opts);

  if (!res.ok) return null;

  return res.json();
}

export async function getUser(userId: number | string) {
  return sendBackendRequest(`/users/${userId}`);
}

export async function getChannels() {
  return sendBackendRequest(`/channels`);
}
