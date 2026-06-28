import { Router } from "express";
import YAML from 'yamljs';
import swaggerUI from "swagger-ui-express";


const router = Router()

const specDocUrl = YAML.load("./docs/openapi.yaml");

router.use('/', swaggerUI.serve)
router.get('/', swaggerUI.setup(specDocUrl));



export default router