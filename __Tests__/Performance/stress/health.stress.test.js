import http from 'k6/http';
import { check, sleep } from 'k6';

// Stress test for extended load on health endpoint
export const options = {
    stages: [
        { duration: '2m', target: 200 },   // ramp up to 200 users
        { duration: '1h', target: 200 },   // stay at 200 users for 1 hour
        { duration: '2m', target: 0 },     // ramp down to 0 users
    ]
};

export default () => {
    const res = http.get('http://localhost:5000/health');
    check(res, {
        'is status 200': (r) => r.status === 200,
        'has status ok': (r) => {
            try {
                const body = r.json();
                return body.status === "ok";
            } catch (e) {
                return false;
            }
        },
        'response time < 1s': (r) => r.timings.duration < 1000,
    });
    sleep(1);
}