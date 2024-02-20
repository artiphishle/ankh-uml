/**
 * @enum
 * @summary Error related to file system operations.
 * @property {string} Read - Error reading a file.
 */
export enum EErrFs {
  LsStatSync = 'ERR_FS_LS_STAT_SYNC',
  ReadDirSync = 'ERR_FS_READ_DIR_SYNC',
  ReadSync = 'ERR_FS_READ_SYNC',
  WriteSync = 'ERR_FS_WRITE_SYNC',
}

/**
 * @enum
 * @summary Error related to rendering a diagram.
 * @property {string} Invalid - Renderer not in {Ankh.Renderer}
 */
export enum EErrRenderer {
  Invalid = 'ERR_RENDERER_INVALID',
}
