import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    vus: 5,
    duration: "20s",
}

export default () => {
    const url = "http://localhost:5000/health";

    const res = http.get(url);
    check(res, {
        "is status 200": (r) => r.status === 200,
        "has status ok": (r) => {
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