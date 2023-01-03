import { BetVictor } from "../../services/betvictor/types";

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
          desc: Record<string, string>;
        }

        export interface SportEvents {
          sportId: number;
          sportEvents: Array<Event>;
        }

        export interface Body {
          events: Array<SportEvents>;
        }
      }
    }
    export namespace Event {
      export namespace Response {
        export interface Market {
          id: number;
          st: number;
          pltNP: number;
          ca: boolean;
          next: boolean;
          ew: boolean;
          o: Array<BetVictor.Response.Outcomes>;
          status: number;
          current: boolean;
          des: Record<string, string>;
          mbl: number;
          mtId: number;
          mtid: number;
          eId: number;
          pId: number;
          pid: number;
          prdDsc: Record<string, string>;
          pltD: number;
          pltDes: Record<string, string>;
          mtDimension: string;
          p: Record<string, string>;
        }

        export interface Event {
          id: number;
          event_type: string;
          event_path_id: number;
          sport_id: number;
          desc: Record<string, string>;
          oppADesc: Record<string, string>;
          oppAId: number;
          oppBDesc: Record<string, string>;
          oppBId: number;
          american: null;
          inPlay: boolean;
          time: number;
          pos: number;
          markets: Array<Market>;
          eventPathTree: {
            table: Record<any, any>;
          };
          metadata: {
            badges: Array<string>;
          };
          has_stream: boolean;
          scoreboard: {
            addresses: {
              comment: string;
              essentialScoreboard: string;
              essentialScoreboardCallback: string;
              stats: string;
              timeline: string;
              overviewComment: string;
            };
            clockInSeconds: number;
            validAt: number;
            reversedClock: boolean;
            periodKey: string;
            clockStatus: string;
            marketSuspensionReason: string;
            externalScoreboardConfiguration?: {
              eventId: number;
              sportId: number;
              providerEventId: number;
              provider: string;
              providerDescription: string;
              cdnUrl: string;
            };
            inPlay: boolean;
            redCardA: number;
            redCardB: number;
            stoppageTime: string;
            matchLength: number;
            eId: number;
            sId: number;
            clk: string;
            run: boolean;
            dsc: string;
            code: number;
            sTs: number;
            cal: boolean;
            act: number;
            oaId: number;
            obId: number;
            scr: string;
            scrA: number;
            scrB: number;
            pId: number;
          };
        }

        export interface Body {
          event: Event;
        }
      }
    }
  }
}
