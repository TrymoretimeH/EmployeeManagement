import { Employee } from "../../pages/employees/employees.component";


export class tokenUtil {
    public static getToken(): any {
        return localStorage.getItem("token");
    }

    public static setToken(token: string) {
        localStorage.setItem("token", token);
    }

    public static removeToken() {
        localStorage.removeItem("token");
    }

    public static checkTokenExpiration(token: string): boolean {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp;
        const now = Math.floor(Date.now() / 1000);

        return exp < now;
    }

    public static getTokenPayload(token: string): any {
        const payload = JSON.parse(atob(token.split(".")[1]));

        return payload;
    }

    public static getUserName(token: string): string | null {
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
    
            return payload.sub;
        }
        return null;
    }

    public static getEmployeeDetails(token: string): Employee | null {
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
    
            return payload.employee;
        }
        return null;
    }

    public static getRoles(token: string | null): string {
        if (token) {
            
            return this.getTokenPayload(token).roles;
        }
        return 'Default';
    }
}