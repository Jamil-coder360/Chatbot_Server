export type TErrorSource = {
    path: string | number|null;
    message: string;
}
export type TgenaricErrorResponse = {
    statusCode: number;
    message: string;
    errorMessages: TErrorSource[];
}