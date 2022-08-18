import { store, StoreState } from "@/store";
import CONST from "@/utils/const";

async function sendBackendRequest(path: string, opts?: RequestInit) {
  const token = (store.state as StoreState).auth.token;

  opts = {
    headers: { Authorization: `Bearer ${token}` },
    ...opts,
  };
  const res = await fetch(CONST.BackendURL + path, opts);

  if (!res.ok) return null;

  return res.json();
}

export async function getMessages(channelId: number) {
  return sendBackendRequest(`/channels/${channelId}/messages`);
}

export async function createChannel(channelName: string) {
  return sendBackendRequest(`/channels`, {
    method: "POST",
    body: JSON.stringify({ channelName }),
  });
}

export async function getChannels() {
  return sendBackendRequest(`/channels`);
}

export async function deleteChannel(channelId: number) {
  return sendBackendRequest(`/channels`, {
    method: "DELETE",
    body: JSON.stringify({ channelId }),
  });
}
