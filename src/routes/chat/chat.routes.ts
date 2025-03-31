// @ts-nocheck

import { Router, Express } from "express";
import { ChatMessage } from "../../models/chat/chatMessage.model";

const messagesRouter = Router();

//  enviar mensagem
messagesRouter.post("/messages", async (req, res) => {
  const { userId, content, isFromSupport } = req.body;

  try {
    if (isFromSupport) {
      const lastUserMessage = await ChatMessage.findOne({
        where: { userId, isFromSupport: false, isRead: false },
        order: [["createdAt", "DESC"]],
      });

      if (lastUserMessage) {
        await lastUserMessage.update({ isRead: true });
      }
    }

    const message = await ChatMessage.create({
      userId,
      content,
      isFromSupport,
    });
    res.status(201).json(message);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

//  obter mensagens não respondidas pelo suporte
messagesRouter.get("/messages/unanswered", async (_, res) => {
  try {
    const messages = await ChatMessage.findAll({
      where: { isFromSupport: false, isRead: false },
    });
    res.json(messages);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

//  obter mensagens de um usuário
messagesRouter.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await ChatMessage.findAll({ where: { userId } });
    res.json(messages);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

messagesRouter.patch("/messages/mark-as-read", async (req, res) => {
  const { userId, isFromSupport } = req.body;

  try {
    // marca mensagens como lidas com base em quem está visualizando
    const condition = isFromSupport
      ? { userId, isFromSupport: false, isRead: false }
      : { userId, isFromSupport: true, isRead: false };

    await ChatMessage.update({ isRead: true }, { where: condition });

    res.status(200).json({ message: "Mensagens marcadas como lidas." });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

messagesRouter.get("/messages/:userId/read-status", async (req, res) => {
  const { userId } = req.params;

  try {
    // busca mensagens não lidas separadas por suporte e usuário
    const userUnreadMessages = await ChatMessage.count({
      where: { userId, isFromSupport: false, isRead: false },
    });

    const supportUnreadMessages = await ChatMessage.count({
      where: { userId, isFromSupport: true, isRead: false },
    });

    res.status(200).json({
      userUnreadMessages,
      supportUnreadMessages,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default messagesRouter;
