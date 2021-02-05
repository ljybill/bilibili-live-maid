declare module 'bilibili-live' {
  export class DanmakuService {
    constructor(options: { roomId: number });

    public connect();

    public on(eventType: string, callback: () => void);
  }

  export default DanmakuService;
}
