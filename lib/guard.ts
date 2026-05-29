import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";

/** Retorna true se a requisicao tem uma sessao de admin valida. */
export async function isAuthed(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token);
}
