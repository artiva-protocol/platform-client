export default interface IIPFSAdapter {
  generateUserKey(): Promise<string>;
  uploadFile(
    file: File,
    token: string,
    onFileProgress?: (prog: number) => void
  ): Promise<string>;
}
