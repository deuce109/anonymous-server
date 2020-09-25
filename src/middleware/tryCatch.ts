export function tryCatch(request, response, next) {
    try {
        next()
    } catch (e) {
        response.status(500).send()
    }
}