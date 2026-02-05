export async function loginAs(apiContext, username, password) {
    const response = await apiContext.post("/api/auth/login", {
        data: { username, password }
    });
    
    if (response.status() !== 200) {
        throw new Error(`Login failed for ${username}, status: ${response.status()}`);
    }
    
    const body = await response.json();
    
    if (!body.token) {
        throw new Error("Login failed, token not returned");
    }
    
    return { token: body.token, tokenType: body.tokenType || "Bearer" };
}