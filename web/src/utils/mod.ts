export const printBanner = (version: string) => {
    console.log.apply(globalThis.console,[
        "\n %c %c %c Caviar " + "v."+ version + " - 🚀" + "WebGPU" + "  %c  %c  https://github.com/load1n9/caviar",
        'background: #d48e1e; padding:5px 0;',
        'background: #e67615; padding:5px 0;',
        'color: #e67615; background: #030307; padding:5px 0;',
        'background: #e67615; padding:5px 0;',
        'background: #d48e1e; padding:5px 0;',
    ]);
}