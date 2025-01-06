export type ActionState<T = undefined> =
  | { status: "success"; data: T }
  | { status: "error"; message: string };
