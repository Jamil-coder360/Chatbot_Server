import { Router } from "express";
import contentController from "./content.controller";


const router:Router = Router();

router.patch('/:id', contentController.updateContents);
router.get('/', contentController.getContents);

export const contentRouter = router;