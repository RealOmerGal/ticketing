import express from "express";
import { currentUser } from "@illaygal/ogcommon";
const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req: any, res: any) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

