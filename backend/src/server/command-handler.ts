export const commandHandler = (cmd: string, ...args: string[]) => {
    switch (cmd) {
        case 'exit':
        case 'quit': {
            Deno.exit(0)
        }
    }
}
