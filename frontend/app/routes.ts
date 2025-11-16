import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("upload", "routes/upload.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
