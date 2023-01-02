export namespace BetVictor {
  export type BetVictorService = {
    getData: (request?: BetVictor.Request.Type) => Promise<BetVictor.Response.Body>;
  }

  export namespace Request {
    export interface Type {
      language: string;
    }
  }

  export namespace Response {
    interface Period {
      "desc": string;
      "long_desc": string;
      "pIds": Array<number>,
      "config": {
        "filter": string;
      }
    }

    interface MarketType {
      "mtId": number;
      "pos": number;
      "desc": string;
      "mtDesc": string;
      "coupon_name": string;
      "headers": Array<string>,
      "periods": Array<Period>,
      "pId": number;
      "pDesc": string;
      "sport_id": number;
    }

    interface Outcomes {
      "rcNum": number;
      "pr": number;
      "price": {
        "oid": number;
        "prid": number;
        "pr": string;
        "prd": number;
        "fdp": string;
        "h": boolean;
        "ms": number;
        "os": number;
        "timestamp": number;
      },
      "id": number;
      "des": string;
      "hidden": boolean;
      "prId": number;
      "lineId": number;
      "shD": string;
      "wdrn": boolean;
      "prF": string;
      "op": number;
    }

    interface Market {
      "id": number;
      "st": number;
      "pltNP": number;
      "ca": boolean;
      "next": boolean;
      "ew": boolean;
      "o": Array<Outcomes>;
      "status": number;
      "current": boolean;
      "des": string;
      "mbl": number;
      "mtId": number;
      "mtid": number;
      "eId": number;
      "pId": number;
      "pid": number;
      "prdDsc": string;
      "pltD": number;
      "pltDes": string;
      "mtDimension": string;
      "p": string;
    }

    interface Event {
      "id": number;
      "event_type": string;
      "event_path_id": number;
      "sport_id": number;
      "desc": string;
      "oppADesc": string;
      "oppAId": number;
      "oppBDesc": string;
      "oppBId": number;
      "american": null,
      "inPlay": boolean;
      "time": number;
      "pos": number;
      "markets": Array<Market>;
      "eventPathTree": {
        "table": Record<any, any>;
      },
      "metadata": {
        "badges": Array<string>;
      },
      "has_stream": boolean;
      "scoreboard": {
        "addresses": {
          "comment": string;
          "essentialScoreboard": string;
          "essentialScoreboardCallback": string;
          "stats": string;
          "timeline": string;
          "overviewComment": string;
        },
        "clockInSeconds": number;
        "validAt": number;
        "reversedClock": boolean;
        "periodKey": string;
        "clockStatus": string;
        "marketSuspensionReason": string;
        "inPlay": boolean;
        "redCardA": number;
        "redCardB": number;
        "stoppageTime": string;
        "matchLength": number;
        "eId": number;
        "sId": number;
        "clk": string;
        "run": boolean;
        "dsc": string;
        "code": number;
        "sTs": number;
        "cal": boolean;
        "act": number;
        "oaId": number;
        "obId": number;
        "scr": string;
        "scrA": number;
        "scrB": number;
        "pId": number;
      }
    }

    interface Competions {
      "id": number;
      "desc": string;
      "pos": number;
      "events": Array<Event>;
    }

    interface Sport {
      "id": number;
      "epId": number;
      "desc": string;
      "pos": number;
      "ne": number;
      "eic": number;
      "v": boolean;
      "mc": boolean;
      "ncmc": number;
      "nemc": number;
      "hasInplayEvents": boolean;
      "hasUpcomingEvents": boolean;
      "marketTypes": Array<MarketType>;
      "comp": Array<Competions>;
    }

    export interface Body {
      "status": {
        "success": boolean;
        "errorCode": number;
        "extraInfo": Record<any, any>;
      },
      "result": {
        "transitions_pgate_path": string;
        "total_number_of_events": number;
        "sports": Array<Sport>;
      }
    }
  }
}
