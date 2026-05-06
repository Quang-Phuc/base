export interface RequestFeApiModel<T> {
    authenType: string;
    data?: T;
}

export interface RequestOptions {
    skipLoading?: boolean;
    url: string | null;
}

export interface ResponseModel<T> {
    body: BodyResponse<T>;
    error?: ErrorResponse;
}

export interface BodyResponse<T> {
    status: string;
    authenType: string;
    data: T;
}

export interface ErrorResponse {
    code: string;
    desc: string;
    messageVn: string;
    messageEn: string;
}

export interface ILdapLoginRes {
    email: string;
    userCode: string;
    phone: string;
    type: string;
    fullName: string;
    employeeId: string;
    isOTP: boolean;
    token: string;
    transactionId: string;
    delegateId: number;
    firstLoginFlag: boolean;
}

export interface AuthRequest {
    username: string;
    password: string;
    authenType?: string;
    otp?: string;
    transactionId?: string;
    checkOTP?: boolean;
    isRemember?: boolean;
}
