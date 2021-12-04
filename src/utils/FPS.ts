export const FPS = (cap: number) => {
    let start = performance.now();
    let frames = 0;
    return () => {
      frames++;
      if ((performance.now() - start) >= 1000) {
        start = performance.now();
        console.log(`FPS: ${frames}`);
        frames = 0;
      }
  
      Deno.sleepSync(1 / cap * 1000);
    };
  };