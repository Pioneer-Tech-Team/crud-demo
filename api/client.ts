import createClient from "openapi-fetch";
import { paths } from "./schema";

const client = createClient<paths>({
	baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT ?? "http://localhost:3000/",
});
export default client;
