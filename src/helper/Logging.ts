export default function Log(
    message: string,
    error?: string
) {
    if (error) {
        console.error(message + ' - ' + new Date().toLocaleString());
        return;
    }

    console.log(message + ' - ' + new Date().toLocaleString());
}
