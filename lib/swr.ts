import { createHooks } from "swr-openapi";
import { paths } from "../api/schema";
import client from "../api/client";

export const { use: useCompanyGroups } = createHooks(
	client,
	"/api/company-groups"
);
export const { use: useApi } = createHooks<paths>(client, "api");
