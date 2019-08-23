export interface IService {
  setup(...args: any[]): Promise<void>
}
