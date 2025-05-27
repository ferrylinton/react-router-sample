import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/todo-list-route.tsx"),
    route('/todo/:id', 'routes/todo-detail-route.tsx'),
] satisfies RouteConfig;
