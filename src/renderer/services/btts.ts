// 判断是否是函数
// eslint-disable-next-line @typescript-eslint/ban-types
function isFunction(obj: any): obj is Function {
  if (Object.prototype.toString.call(obj) === '[object Function]') {
    return true;
  }
  return false;
}

export interface ITtsParams {
  [prop: string]: any;
}

export interface ITtsOptions {
  autoplay: boolean;
  hidden: boolean;
  volume?: number;
  autoDestroy?: boolean;
  timeout?: number;
  onInit?: (audio: HTMLAudioElement) => void;
  onSuccess?: (audio: HTMLAudioElement) => void;
  onTimeout?: () => void;
  onEnd?: () => void;
  onError?: (errorText: string) => void;
}

const url = 'http://tsn.baidu.com/text2audio';
let isRunning = false;
// FIFO
const cache: Array<any> = [];

function core(params: ITtsParams, options: ITtsOptions) {
  const audio = document.createElement('audio');
  if (options.autoplay) {
    audio.setAttribute('autoplay', 'autoplay');
  }
  if (options.hidden) {
    audio.style.display = 'none';
  } else {
    audio.setAttribute('controls', 'controls');
  }
  if (options.volume) {
    audio.volume = options.volume;
  }

  if (isFunction(options.onInit)) {
    options.onInit(audio);
  }
  const timeout = options.timeout || 60000;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);

  const data: any = {};
  Object.keys(params)
    .forEach((key) => {
      data[key] = params[key];
    });

  data.cuid = data.cuid || data.tok;
  data.ctp = 1;
  data.lan = data.lan || 'zh';
  data.aue = data.aue || 3;

  const fd = Object.keys(data)
    .map((key: string) => `${key}=${encodeURIComponent(data[key])}`);
  const frd = new FileReader();
  xhr.responseType = 'blob';
  xhr.send(fd.join('&'));

  const timer = setTimeout(() => {
    xhr.abort();
    if (isFunction(options.onTimeout)) {
      options.onTimeout();
    }
  }, timeout);
  xhr.onreadystatechange = function onreadystatechange() {
    if (xhr.readyState === 4) {
      clearTimeout(timer);

      if (xhr.status === 200) {
        if (xhr.response.type === 'audio/mp3') {
          document.body.appendChild(audio);
          audio.setAttribute('src', URL.createObjectURL(xhr.response));

          if (options.autoDestroy) {
            audio.onended = function onended() {
              document.body.removeChild(audio);
              if (isFunction(options.onEnd)) {
                options.onEnd();
              }
            };
          }
          if (isFunction(options.onSuccess)) {
            options.onSuccess(audio);
          }
        }

        if (xhr.response.type === 'application/json') {
          frd.onload = function onload() {
            if (isFunction(options.onError)) {
              options.onError(frd.result?.toString() ?? '');
            }
          };
          frd.readAsText(xhr.response);
        }
      }
    }
  };
}

function runner() {
  if (isRunning) {
    return;
  }
  isRunning = true;

  if (cache.length > 0) {
    const [p, o] = cache.pop();
    core(p, {
      ...o,
      onEnd() {
        isRunning = false;
        runner();
      },
    });
  } else {
    isRunning = false;
  }
}

function btts(params: ITtsParams, options: ITtsOptions): void {
  cache.push([params, options]);

  runner();
}

export default btts;
