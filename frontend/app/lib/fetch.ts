export async function fetchWithAuth(url: string | URL, options = {}) {
  let res = await fetch(url, {
    credentials: "include",
    ...options
  });

  if (res.status === 401) {
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      throw new Error("Session expired");
    }

    // retry original request
    res = await fetch(url, { credentials: "include", ...options });
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return await res.json();
  }

  return res;
}
