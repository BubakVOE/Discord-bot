export default function Log(
    message: string,
    error?: Object
) {
    if (error) {
        console.error('❌' + message + ' - ' + new Date().toLocaleString());
        console.error('❌' + error);
        return;
    }

    console.log('✅ '+ message + ' - ' + new Date().toLocaleString());
}
