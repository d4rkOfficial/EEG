export class BufferProcessor {
    private buf = new Uint8Array(0)
    private resolveNext: (() => void) | null = null

    public append(data: Uint8Array): void {
        const newBuf = new Uint8Array(this.buf.length + data.length)
        newBuf.set(this.buf, 0)
        newBuf.set(data, this.buf.length)
        this.buf = newBuf

        if (this.resolveNext) {
            this.resolveNext()
            this.resolveNext = null
        }
    }

    public async *[Symbol.asyncIterator]() {
        let start = 0
        const delimiter = new Uint8Array([0xaa, 0xaa])

        while (true) {
            const idx = this.indexOfSequence(this.buf, delimiter, start)

            if (idx === -1 || this.buf.length < 40) {
                await new Promise<void>((resolve) => {
                    this.resolveNext = resolve
                })
                continue
            }

            if (idx > start) { yield this.buf.subarray(start - 2, idx) }

            start = idx + 2

            if (start >= this.buf.length) {
                this.buf = new Uint8Array(0)
                start = 0
            } else if (start > 1024) {
                this.buf = this.buf.subarray(start)
                start = 0
            }
        }
    }

    private indexOfSequence(
        buf: Uint8Array,
        seq: Uint8Array,
        from = 0,
    ): number {
        for (let i = from; i <= buf.length - seq.length; i++) {
            let matched = true
            for (let j = 0; j < seq.length; j++) {
                if (buf[i + j] !== seq[j]) {
                    matched = false
                    break
                }
            }
            if (matched) { return i }
        }
        return -1
    }
}
