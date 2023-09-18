export const login = (sessionId: string) => {
	localStorage.setItem("isLoggedIn", "true");
	localStorage.setItem("sessionId", sessionId);
};

export function getLoggedUser() {
	return localStorage.getItem("sessionId") ? parseJwt(localStorage.getItem("sessionId")) : {};
}

function parseJwt(token: string | null) {
	if (token) {
		var base64Url = token.split(".")[1];
		var base64 = base64Url?.replace(/-/g, "+")?.replace(/_/g, "/");
		var jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split("")
				.map(function (c) {
					return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join("")
		);
		return JSON.parse(jsonPayload);
	}
	return null;
}
