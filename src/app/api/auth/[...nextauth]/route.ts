import { getHandler } from "@/utils/auth";

const handler = getHandler();

export { handler as GET, handler as POST }