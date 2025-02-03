import express from "express";

import { createService, getAllServices, getActiveServices, updateService,toggleServiceStatus, deleteService } from "../controller/serviceController.js"
import { createServiceCate, getallServiceCate, getServiceCateById, updateServiceCate, disableServiceCate, getActiveServiceCates } from "../controller/servicecateController.js"
import { isAdminAuthenticated, isDoctorAuthenticated } from "../middlewares/auth.js";

const router = express.Router()

router.post("/createservice", isAdminAuthenticated, createService)
router.post("/createservicecate", isAdminAuthenticated, createServiceCate)
router.get("/getallservicecate", getallServiceCate)
router.get("/getservicecate/:id", getServiceCateById)
router.get("/getallservicecatetrue",getActiveServiceCates)
router.put("/updateservicecate/:id",isAdminAuthenticated, updateServiceCate)
router.patch("/disableservicecate/:id",isAdminAuthenticated, disableServiceCate)
router.get("/getallservices/:id", getAllServices)
router.get("/getallservices", getAllServices)
router.get("/getactiveservice", getActiveServices)
router.put("/updateservice/:id", isAdminAuthenticated, updateService)
router.patch("/updateactiveservice/:id", isAdminAuthenticated , toggleServiceStatus)

router.delete("/deleteservice/:id", isAdminAuthenticated,deleteService);

export default router