import * as esbuild from 'esbuild'
import { denoPlugins } from '@luca/esbuild-deno-loader'

{ // server.js
    const entry = './main.ts'
    const outfile = './build/server.js'

    console.log(`Bundling: ${entry} → ${outfile}`)

    await esbuild.build({
        bundle: true,
        entryPoints: [entry],
        format: 'esm',
        minify: true,
        outfile,
        plugins: [...denoPlugins()] as esbuild.Plugin[],
    })

    await esbuild.stop()
}

{ // *.worker.ts -> *.worker.js
    const workers = [...Deno.readDirSync('./src')]
        .filter((f) => f.isFile && f.name.endsWith('.worker.ts'))
        .map((f) => `./src/${f.name}`)

    for (const entry of workers) {
        const base = entry.replace(/^\.\/src\//, '').replace('.ts', '.js')
        const outfile = `./build/${base}`

        console.log(`Bundling: ${entry} → ${outfile}`)

        await esbuild.build({
            bundle: true,
            entryPoints: [entry],
            format: 'esm',
            minify: true,
            outfile,
            plugins: [...denoPlugins()] as esbuild.Plugin[],
        })
    }

    await esbuild.stop()
}
