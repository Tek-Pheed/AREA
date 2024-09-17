export default function API(
    code: number,
    error: boolean,
    message: string,
    data: any
) {
    return { status: code, error: error, message: message, data: data };
}
