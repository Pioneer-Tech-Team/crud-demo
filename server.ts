import { config } from "dotenv";
import { createApp } from "./api";
import { fileURLToPath } from "url";
import { dirname } from "path";

const isDev = process.env.NODE_ENV !== "production";
const __dirname = dirname(fileURLToPath(import.meta.url));

if (isDev) {
	config({ path: __dirname + "/.env.local" });
}

const port = Number(process.env.PORT ?? 3000);

createApp()
	.then((app) =>
		app
			.listen({
				port,
			})
			.then(() => {
				console.log(`Listening at port ${port}`);
			})
	)
	.catch(console.error);
