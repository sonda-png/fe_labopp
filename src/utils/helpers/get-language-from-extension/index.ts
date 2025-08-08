export const getLanguageFromExtension = (extension?: string) => {
    switch (extension) {
        case 'tsx':
        case 'jsx':
            return 'jsx'
        case 'ts':
            return 'typescript'
        case 'js':
            return 'javascript'
        case 'java':
            console.log('java')
            return 'java'
        case 'json':
            return 'json'
        case 'md':
            return 'markdown'
        case 'txt':
            return 'text'
        default:
            return 'text'
    }
}