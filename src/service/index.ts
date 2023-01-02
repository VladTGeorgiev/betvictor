import axios from "axios";
import { BetVictor } from "./types";

export async function createBetVictorService(
  host: string,
  path: string
): Promise<BetVictor.BetVictorService> {
  const getData = async (
    request?: BetVictor.Request.Type
  ): Promise<BetVictor.Response.Body> => {
    try {
      const response = await axios.get<BetVictor.Response.Body>(
        `${host}${request?.language ?? "/en-gb"}${path}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Error fetching data");
    }
  };

  await getData().then(() => {
    console.info("BetVictorService running...");
  });

  return {
    getData,
  };
}
