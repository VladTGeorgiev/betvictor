# BetVictor Proxy API

This project is a proxy server formatting and relaying data from BetVictor API.

## Prerequisites

- [Node.js](https://nodejs.org/en//)
- [npm](https://www.npmjs.com/)

## Installation

```bash
npm install
```

## Start

To start the application, run the following command in your terminal from the root directory of the project

```bash
npm run start
```

## Caching

[node-cache](https://www.npmjs.com/package/node-cache) is used to provide in-memory storage. The implementation is two layered, where data
is ingested from BetVictor API upon starting of the application and then used to serve the controller requests.
Each endpoint also has caching layer where, if the same request is received within the cache lifecycle,
the response will be taken from the cache, rather than from the BetVictorService, or BetVictor API.

## Endpoints

### /sports

Returns a list of sports. Accepts optional "languages" parameter ("en-gb", "de", "zh-cn")

Request:

```bash
GET /api/v1/sports?languages=en-gb,de HTTP/1.1
Host: localhost:3000
Connection: close
User-Agent: RapidAPI/4.1.0 (Macintosh; OS X/13.1.0) GCDHTTPRequest
```

Response:

```json
{
  "sports": [
    {
      "id": 100,
      "desc": {
        "en-gb": "Football",
        "de": "Fußball"
      },
      "pos": 1
    },
    {
      "id": 600,
      "desc": {
        "en-gb": "Tennis",
        "de": "Tennis"
      },
      "pos": 2
    },
...
    {
      "id": 967700,
      "desc": {
        "en-gb": "Winter Sports",
        "de": "Wintersport"
      },
      "pos": 26
    }
  ]
}
```

### /events

Returns a list of events. Accepts optional "sportId" and "languages" parameters ("en-gb", "de", "zh-cn")

Request:

```bash
GET /api/v1/events?sportId=100&languages=en-gb,de HTTP/1.1
Host: localhost:3000
Connection: close
User-Agent: RapidAPI/4.1.0 (Macintosh; OS X/13.1.0) GCDHTTPRequest
```

Response:

```json
{
  "events": [
    {
      "sportId": 100,
      "sportEvents": [
        {
          "id": 1850930600,
          "type": "GAME_EVENT",
          "desc": {
            "en-gb": "Torino v Hellas Verona",
            "de": "FC Turin v Hellas Verona"
          }
        },
        {
          "id": 1850930700,
          "type": "GAME_EVENT",
          "desc": {
            "en-gb": "Spezia v Atalanta",
            "de": "Spezia v Atalanta Bergamo"
          }
        },
...
        {
          "id": 1856079000,
          "type": "GAME_EVENT",
          "desc": {
            "en-gb": "Belgium (Nicolas_Rage) v Germany (Gabiigol)",
            "de": "Belgien (Nicolas_Rage) v Deutschland (Gabiigol)"
          }
        }
      ]
    }
  ]
}
```

### /event

Returns an event. Accepts "languages" parameter ("en-gb", "de", "zh-cn")

Request:

```bash
GET /api/v1/events/1850930600?languages=en-gb,de HTTP/1.1
Host: localhost:3000
Connection: close
User-Agent: RapidAPI/4.1.0 (Macintosh; OS X/13.1.0) GCDHTTPRequest
```

Response:

```json
{
  "event": {
    "id": 1850930600,
    "event_type": "GAME_EVENT",
    "event_path_id": 242259910,
    "sport_id": 100,
    "desc": {
      "en-gb": "Torino v Hellas Verona",
      "de": "FC Turin v Hellas Verona"
    },
...
      "redCardA": 0,
      "redCardB": 0,
      "stoppageTime": "",
      "matchLength": 90,
      "eId": 1850930600,
      "sId": 100,
      "clk": "86:34",
      "run": true,
      "dsc": "2H",
      "code": 235,
      "sTs": 1672839000000,
      "cal": true,
      "act": 4506000,
      "oaId": 3050100,
      "obId": 4506000,
      "scr": "1-1",
      "scrA": 1,
      "scrB": 1,
      "pId": 20
    }
  }
}
```

## License

[ISC](https://choosealicense.com/licenses/isc/)
