import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    vus: 10,
    duration: "30s",
}

export default () => {
    const url = "http://localhost:5000/api/auth/login";
    const payload = JSON.stringify({
        email: "kihorosandra@gmail.com",
        password: "Mimo100."
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);
    check(res, {
        "is status 200": (r) => r.status === 200,
        "has token": (r) => {
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