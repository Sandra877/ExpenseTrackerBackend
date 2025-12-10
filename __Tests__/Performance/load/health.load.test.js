import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 50 },  // ramp up to 50 users
        { duration: '1m', target: 50 },   // stay at 50 users
        { duration: '30s', target: 0 },   // ramp down to 0 users
    ],
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
        }
    });
    sleep(1);
}