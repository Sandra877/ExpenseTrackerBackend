import { saveMessage } from "../repositories/message.repository";
import { getUserByEmail } from "../repositories/auth.repository";

export const sendMessage = async (userId: number, data: any) => {
  const user = await getUserByEmail(data.email);

  if (!user) throw new Error("User not found");
  if (!user.isVerified) throw new Error("Email not verified");

  return await saveMessage({
    userId,
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
  });
};
