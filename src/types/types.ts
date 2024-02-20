/**
 * @enum
 * @summary Available exporters for the Ankhorage tools.
 * @property {string} Mermaid - The Mermaid exporter.
 * @property {string} PlantUml - The PlantUml exporter.
 */
export enum ERenderer {
  Mermaid = 'Mermaid',
  PlantUml = 'PlantUml',
}

/**
 * @interface
 * @summary Available options for the Ankhorage tools.
 * @property {EExporter} exporter - The exporter to use.
 * @property {string} outDir - The output directory.
 * @property {string} root - The path to the file to start parsing from.
 */
interface AllOptions {
  readonly renderer: ERenderer;
  readonly outDir: string;
  readonly rootFile: string;
}

export type Options = Partial<AllOptions>;
export type ParseOptions = Pick<AllOptions, 'rootFile'>;
export type RenderOptions = Pick<AllOptions, 'renderer' | 'outDir'>;
export interface Diagram {
  readonly parse: (options: ParseOptions) => this;
  readonly render: (options: RenderOptions) => this;
}
