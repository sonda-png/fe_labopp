export const convertLocalTime = (time: string) => {
    const date = new Date(time)
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}