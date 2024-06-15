"use client";

import { User } from "@prisma/client";
import { createContext, useState } from "react";

type UserFromAPI = Omit<User, "password">;
type UserContextValue = {
	user: UserFromAPI | null;
	setUser: (user: UserFromAPI | null) => void;
};

export const UserContext = createContext<UserContextValue>({
	user: null,
	setUser: () => {},
});

export default function UserProvider({
	children,
	user = null,
}: {
	children: JSX.Element;
	user: UserFromAPI | null;
}) {
	const [value, setValue] = useState(user);
	return (
		<UserContext.Provider value={{ user: value, setUser: setValue }}>
			{children}
		</UserContext.Provider>
	);
}
