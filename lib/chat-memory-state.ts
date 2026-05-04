import type { QueueEntry, StateAdapter } from "chat";

function randomToken(): string {
  return `mem_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * In-process state for the Chat SDK when Redis is not configured.
 * Suitable for single-instance / local dev only.
 */
export function createChatMemoryState(): StateAdapter {
  const locks = new Map<string, { token: string; expiresAt: number }>();
  const kv = new Map<string, unknown>();
  const lists = new Map<string, unknown[]>();
  const queues = new Map<string, QueueEntry[]>();
  const subs = new Set<string>();

  return {
    async connect() {},
    async disconnect() {},
    async acquireLock(threadId, ttlMs) {
      const now = Date.now();
      const existing = locks.get(threadId);
      if (existing && existing.expiresAt > now) return null;
      const token = randomToken();
      const expiresAt = now + ttlMs;
      locks.set(threadId, { token, expiresAt });
      return { threadId, token, expiresAt };
    },
    async releaseLock(lock) {
      const cur = locks.get(lock.threadId);
      if (cur?.token === lock.token) locks.delete(lock.threadId);
    },
    async extendLock(lock, ttlMs) {
      const cur = locks.get(lock.threadId);
      if (cur?.token !== lock.token) return false;
      cur.expiresAt = Date.now() + ttlMs;
      return true;
    },
    async forceReleaseLock(threadId) {
      locks.delete(threadId);
    },
    async appendToList(key, value, options) {
      let arr = lists.get(key) ?? [];
      arr = [...arr, value];
      const max = options?.maxLength;
      if (max && arr.length > max) arr = arr.slice(-max);
      lists.set(key, arr);
    },
    async getList<T = unknown>(key: string): Promise<T[]> {
      return [...(lists.get(key) ?? [])] as T[];
    },
    async get(key) {
      return kv.has(key) ? (kv.get(key) as never) : null;
    },
    async set(key, value) {
      kv.set(key, value);
    },
    async setIfNotExists(key, value) {
      if (kv.has(key)) return false;
      kv.set(key, value);
      return true;
    },
    async delete(key) {
      kv.delete(key);
    },
    async enqueue(threadId, entry, maxSize) {
      let q = queues.get(threadId) ?? [];
      q = [...q, entry];
      if (q.length > maxSize) q = q.slice(-maxSize);
      queues.set(threadId, q);
      return q.length;
    },
    async dequeue(threadId) {
      const q = queues.get(threadId);
      if (!q?.length) return null;
      const [first, ...rest] = q;
      if (rest.length === 0) queues.delete(threadId);
      else queues.set(threadId, rest);
      return first ?? null;
    },
    async queueDepth(threadId) {
      return queues.get(threadId)?.length ?? 0;
    },
    async subscribe(threadId) {
      subs.add(threadId);
    },
    async unsubscribe(threadId) {
      subs.delete(threadId);
    },
    async isSubscribed(threadId) {
      return subs.has(threadId);
    },
  };
}
