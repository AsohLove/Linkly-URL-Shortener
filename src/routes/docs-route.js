import { readFileSync } from "node:fs";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const specPath = join(__dirname, "../../docs/openapi.yaml");

const specText = readFileSync(specPath, "utf8");

const spec = YAML.parse(specText);

export function mountDocs(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

  app.get("/openapi.yaml", (req, res) => {
    res.type("text/yaml").send(specText);
  });
}