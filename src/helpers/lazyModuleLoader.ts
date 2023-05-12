import {readdirSync} from "fs";
import {readdir} from "fs/promises";
import path from "path";

const getRequirePath = (dir: string, fileName: string) => {
    // this length includes the '.'
    const extensionLength = path.extname(fileName).length;
    return path.join(dir, fileName.slice(0, -extensionLength));
};

interface LoadDirectoryFileResult<T> {
    path: string;
    value: T;
}

export const LoadDirAsSync = <T>(dir: string): LoadDirectoryFileResult<T>[] => {
    const files = readdirSync(dir) //
        .filter((name) => name.endsWith(".ts") || name.endsWith(".js"))
        .map((name) => getRequirePath(dir, name))
        .map((requirePath) => path.resolve(requirePath));

    const load = (path: string) => ({path: path, value: require(path) as T});
    return files.map((path) => load(path));
};

export const LoadDirAs = async <T>(
    dir: string
): Promise<LoadDirectoryFileResult<T>[]> => {
    const files = (await readdir(dir)) //
        .filter((name) => name.endsWith(".ts") || name.endsWith(".js"))
        .map((name) => getRequirePath(dir, name))
        .map((requirePath) => path.resolve(requirePath));

    const load = async (path: string) => ({path: path, value: (await import(path)) as T});
    return await Promise.all(files.map(async (path) => await load(path)));
};

/**
 * Absolute path to the root of the running source. The resulting
 * path contains, for example, index.js post-build or index.ts in
 * development.
 */
export const SourceRootDir = path.resolve(__dirname, "..");

/**
 * Absolute path to the root of the project. The resulting path
 * contains, for example, the bot configuration (config.json5).
 */
export const ProjectRootDir = path.resolve(__dirname, "../..");
