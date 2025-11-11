export const scrollToElement = (elementId: string, block?: ScrollLogicalPosition) => {
    const element = document.getElementById(elementId)
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block
        })
    }
}
