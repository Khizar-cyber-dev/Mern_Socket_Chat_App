import { Router } from "express";
import { getAllContacts, getChatByUserId, getChatPartners, sendMessage } from "../controller/messageController";
import { arcjetMiddleware } from "../middleware/arcjetMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.use(arcjetMiddleware, authMiddleware);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getChatByUserId);
router.post("/send/:id", sendMessage);

export default router;