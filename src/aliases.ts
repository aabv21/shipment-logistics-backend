import "module-alias/register";
import { addAliases } from "module-alias";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

addAliases({
  "@modules": `${__dirname}/../modules`,
  "@config": `${__dirname}`,
  "@shared": `${__dirname}/../shared`,
  "@user": `${__dirname}/../modules/user`,
  "@middlewares": `${__dirname}/../middlewares`,
  "@shipment": `${__dirname}/../modules/shipment`,
});
