import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 100 }, // ramp up to 100 users
        { duration: '2m', target: 100 }, // stay at 100 users
        { duration: '30s', target: 0 },  // ramp down to 0 users
    ],
};

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

        const res = http.get(expensesUrl, expensesParams);
        check(res, {
            'is status 200': (r) => r.status === 200,
        });
    }

    sleep(1);
}