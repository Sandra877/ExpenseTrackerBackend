import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    vus: 8,
    duration: "25s",
}

export default () => {
    // First login to get auth token
    const loginUrl = "http://localhost:5000/api/auth/login";
    const loginPayload = JSON.stringify({
        email: "kihorosandra@gmail.com",
        password: "Mimo100."
    });

    const loginParams = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const loginRes = http.post(loginUrl, loginPayload, loginParams);

    // Check if login was successful and get token
    if (loginRes.status === 200) {
        const loginData = loginRes.json();
        const authToken = loginData.token;

        // Test getting expenses with auth token
        const expensesUrl = "http://localhost:5000/api/expenses";
        const expensesParams = {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        };

        const expensesRes = http.get(expensesUrl, expensesParams);
        check(expensesRes, {
            "expenses status 200": (r) => r.status === 200,
            "expenses has array": (r) => {
                try {
                    const body = r.json();
                    return Array.isArray(body);
                } catch (e) {
                    return false;
                }
            }
        });
    } else {
        console.log(`Login failed: ${loginRes.status}`);
    }

    sleep(1);
}