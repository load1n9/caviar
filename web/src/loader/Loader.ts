import { World } from "../World.ts";

// based on https://github.com/phaserjs/phaser/blob/main/src/loader/Loader.ts
interface ILoader {
  baseURL: string;
  path: string;
  crossOrigin: string;

  isLoading: boolean;
  progress: number;
}
interface IFile {
  key: string;
  url: string;
  skipCache: boolean;
  data?: unknown;
  error?: Error | unknown;
  response?: Response;
}
type RequestFileType = (loader?: ILoader) => Promise<IFile>;

export class Loader {
  baseUrl = "";
  path = "";
  crossOrigin = "anonymous";
  maxParallelDownloads = -1;
  isLoading = false;
  progress = 0;
  queue: Set<RequestFileType> = new Set();
  inflight: Set<RequestFileType> = new Set();
  completed: Set<IFile> = new Set();
  // deno-lint-ignore ban-types
  onComplete?: Function;
  // deno-lint-ignore ban-types
  onError?: Function;
  constructor(public world: World) {}
  reset(): void {
    this.queue.clear();
    this.inflight.clear();
    this.completed.clear();
    this.progress = 0;
  }

  add(...file: RequestFileType[]) {
    file.forEach((entity) => {
      console.log("Loader.add", entity);
      this.queue.add(entity);
    });
  }
  start(): Promise<Loader> | null {
    if (this.isLoading) {
      return null;
    }

    return new Promise((resolve, reject) => {
      this.completed.clear();
      this.progress = 0;

      if (this.queue.size > 0) {
        this.isLoading = true;

        this.onComplete = resolve;
        this.onError = reject;

        console.log("Loader.start");

        this.world.eventManager.emit("loader:start", this);

        this.nextFile();
      } else {
        this.progress = 1;
        this.world.eventManager.emit("loader:complete", this);
        resolve(this);
      }
    });
  }
  nextFile(): void {
    let limit = this.queue.size;

    if (this.maxParallelDownloads !== -1) {
      limit = Math.min(limit, this.maxParallelDownloads) - this.inflight.size;
    }

    console.log("Loader.nextFile", limit);

    if (limit) {
      console.log("Batching", limit, "files to download");

      const iterator = this.queue.values();

      while (limit > 0) {
        const loadFile = iterator.next().value;

        this.inflight.add(loadFile);

        this.queue.delete(loadFile);

        loadFile(this)
          .then((file: IFile) => {
            this.#fileComplete(file);
            this.#updateProgress(file, loadFile);
          })
          .catch((file: IFile) => {
            this.#fileError(file);
            this.#updateProgress(file, loadFile);
          });

        limit--;
      }
    } else if (this.inflight.size === 0) {
      console.log("Loader inflight zero");
      this.stop();
    }
  }

  stop(): void {
    if (!this.isLoading) {
      return;
    }

    this.isLoading = false;

    this.world.eventManager.emit("loader:complete", this.completed);

    this.onComplete!();

    this.completed.clear();
  }

  #updateProgress(file: IFile, queueEntry: RequestFileType): void {
    this.inflight.delete(queueEntry);

    this.completed.add(file);

    const totalCompleted = this.completed.size;
    const totalQueued = this.queue.size + this.inflight.size;

    if (totalCompleted > 0) {
      this.progress = totalCompleted / (totalCompleted + totalQueued);
    }

    this.world.eventManager.emit("loader:progress", [
      this.progress,
      totalCompleted,
      totalQueued,
    ]);

    this.nextFile();
  }

  #fileComplete(file: IFile): void {
    console.log("Loaded", file.key);
    this.world.eventManager.emit("loader:filecomplete", file);
  }

  #fileError(file: IFile): void {
    console.log("Failed to Load", file.key);
    this.world.eventManager.emit("loader:fileerror", file);
  }

  totalFilesToLoad(): number {
    return this.queue.size + this.inflight.size;
  }

  setBaseUrl(url = ""): void {
    if (url !== "" && url.substring(-1) !== "/") {
      url = url.concat("/");
    }
    this.baseUrl = url;
  }

  setPath(path = ""): void {
    if (path !== "" && path.substring(-1) !== "/") {
      path = path.concat("/");
    }
    this.path = path;
  }

  setCORS(crossOrigin: string): void {
    this.crossOrigin = crossOrigin;
  }

  setMaxParallelDownloads(max: number): void {
    this.maxParallelDownloads = max;
  }
}
