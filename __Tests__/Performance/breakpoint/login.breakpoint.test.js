import http from 'k6/http';
import { check, sleep } from 'k6';

// Breakpoint test for login endpoint to find system limits
export const options = {
    stages: [
        { duration: '3m', target: 2000 },   // ramp up to 2000 users
        { duration: '5m', target: 5000 },   
        { duration: '3m', target: 8000 },   
        { duration: '2m', target: 0 },      // ramp down to 0 users
    ]
};

export default () => {
    const url = "http://localhost:5000/api/auth/login";
    const payload = JSON.stringify({
        email: "sandrakihoro@gmail.com",
        password: "Mimo100."
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);
    check(res, {
        'is status 200': (r) => r.status === 200,
        'response time < 2s': (r) => r.timings.duration < 2000,
    });
    sleep(1);
}