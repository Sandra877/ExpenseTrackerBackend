import http from 'k6/http';
import { check, sleep } from 'k6';

// Breakpoint test to find system limits
export const options = {
    stages: [
        { duration: '2m', target: 5000 },   // ramp up to 5000 users
        { duration: '5m', target: 10000 },  // ramp up to 10000 users
        { duration: '2m', target: 15000 },  // ramp up to 15000 users
        { duration: '1m', target: 0 },      // ramp down to 0 users
    ]
};

export default () => {
    const res = http.get('http://localhost:5000/health');
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
    sleep(1);
}