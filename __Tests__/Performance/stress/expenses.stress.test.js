import http from 'k6/http';
import { check, sleep } from 'k6';

// Stress test for extended load on expenses endpoint
export const options = {
    stages: [
        { duration: '5m', target: 300 },   // ramp up to 300 users
        { duration: '30m', target: 300 },  // stay at 300 users for 30 minutes
        { duration: '5m', target: 0 },     // ramp down to 0 users
    ]
};

export default () => {
    // First login to get auth token
    const loginUrl = "http://localhost:5000/api/auth/login";
    const loginPayload = JSON.stringify({
        email: "Kihorosandra@gmail.com",
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
            'response time < 5s': (r) => r.timings.duration < 5000,
        });
    }

    sleep(1);
}