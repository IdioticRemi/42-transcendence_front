import { store } from "@/store";
import CONST from "@/utils/const";

export async function sendBackendRequest(path: string, opts?: RequestInit) {
  const token = store.state.auth.token;

  if (!opts)
    opts = {};
  if (!opts.headers)
    opts.headers = {};
  opts.headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(CONST.BackendURL + path, opts);
  console.debug(res);
  if (!res.ok) return null;

  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

export async function getUser(userId: number | string) {
  return sendBackendRequest(`/users/${userId}`);
}

export async function getChannels() {
  return sendBackendRequest(`/channels`);
}
