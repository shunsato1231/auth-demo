export interface Output<outputDTO> {
  show(result: outputDTO): void | Promise<void>;
}
