import { default as openapiTS } from "openapi-typescript";
import { createApp } from "@/api";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { writeFile } from "fs/promises";

const isDev = process.env.NODE_ENV !== "production";
const __dirname = dirname(fileURLToPath(import.meta.url));

if (isDev) {
	config({ path: join(__dirname, "..", ".env.local") });
}

void (async function main() {
	const app = await createApp();
	const contents = await openapiTS(app.swagger() as any);
	const filePath = join(__dirname, "..", "api", "schema.ts");

	await writeFile(filePath, contents);
	console.log(`Wrote client SDK definitions to ${filePath}`);
	process.exit();
})();
