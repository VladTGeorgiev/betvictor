export const supportedLanguages = ['en-gb' , 'de' , 'zh-cn'];

export namespace V1Router {
  export namespace Endpoints {
    export namespace Sports {
      export namespace Response {
        export interface Sport {
          id: number;
          desc: Record<string, string>;
          pos: number;
        }
        export interface Body {
          sports: Array<Sport>;
        }
      }
    }
    export namespace Events {
      export namespace Response {
        export interface Event {
          id: number;
          type: string;
          desc: string;
        }
        export interface Body {
          events: Record<string, Array<Event>>;
        }
      }
    }
  }
}
