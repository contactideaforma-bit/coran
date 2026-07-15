/* Client minimal Upstash Redis (API REST, sans dépendance).
 * Variables d'environnement : UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN. */

export async function redis<T = unknown>(
  ...args: (string | number)[]
): Promise<T> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("Upstash non configuré (UPSTASH_REDIS_REST_URL/TOKEN)");
  }
  const res = await fetch(
    `${url}/${args.map((a) => encodeURIComponent(String(a))).join("/")}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  const json = (await res.json()) as { result?: T; error?: string };
  if (json.error) throw new Error(json.error);
  return json.result as T;
}
