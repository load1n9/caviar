
// export function JSONFile (key: string, url?: string): RequestFileType {
//     return (loader?: ILoader): Promise<IFile> =>
//     {
//         const file = CreateFile(key, GetURL(key, url, 'json', loader), fileData.skipCache);

//         const cache = Cache.get('JSON');

//         const preload = (file: IFile) =>
//         {
//             return (cache && (!cache.has(key) || !file.skipCache));
//         };

//         const onload = async (file: IFile) =>
//         {
//             file.data = await file.response.json();

//             if (!file.skipCache)
//             {
//                 cache.set(key, file.data);
//             }

//             return true;
//         };

//         return RequestFile(file, preload, onload, fileData);
//     };
// }