import { join } from "path";
import { storagePath } from "./storagepath";

export const jwtPath = (path = "") => {
  return storagePath(join("sessions", path));
};
