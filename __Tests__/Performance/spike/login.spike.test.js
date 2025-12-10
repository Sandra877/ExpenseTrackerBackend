import http from 'k6/http';
import { check, sleep } from 'k6';

// Spike test for login endpoint
export const options = {
    stages: [
        { duration: '2m', target: 50 },    // start with 50 users
        { duration: '1m', target: 500 },   // spike to 500 users
        { duration: '1m', target: 1000 },  // spike to 1000 users
        { duration: '30s', target: 0 },    // drop back to 0 users
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
        'has token': (r) => {
            try {
                const body = r.json();
                return body.token !== undefined;
            } catch (e) {
                return false;
            }
        }
    });
    sleep(1);
}