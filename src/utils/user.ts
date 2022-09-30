import { store } from "@/store";
import { BackendURL } from "@/utils/const";

export async function sendBackendRequest(path: string, opts?: RequestInit) {
  try {
    const token = store.state.auth.token;
    
    if (!opts)
      opts = {};
    if (!opts.headers)
      opts.headers = {};
    opts.headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(BackendURL + path, opts);
    
    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

export async function getUser(userId: number | string) {
  return sendBackendRequest(`/users/${userId}`);
}

export async function getChannels() {
  return sendBackendRequest(`/channels`);
}
