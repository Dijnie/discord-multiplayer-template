import { defineServer, defineRoom } from "colyseus";
import { MonitorOptions, monitor } from "@colyseus/monitor";
import { WebSocketTransport } from "@colyseus/ws-transport";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import { GameRoom } from "./rooms/GameRoom";

dotenv.config({ path: "../../.env" });

const port = Number(process.env.PORT) || 8080;

const server = defineServer({
  transport: new WebSocketTransport({}),
  rooms: {
    game: defineRoom(GameRoom, {
      filterBy: ["channelId"],
    }),
  },
  express: (app) => {
    app.use(express.json());

    if (process.env.NODE_ENV === "production") {
      const clientBuildPath = path.join(__dirname, "../../client/dist");
      app.use(express.static(clientBuildPath));
    }

    // Colyseus monitor
    app.use("/colyseus", monitor(server as Partial<MonitorOptions>));

    // Fetch token from developer portal and return to the embedded app
    app.post("/api/token", async (req, res) => {
      const response = await fetch(`https://discord.com/api/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "authorization_code",
          code: req.body.code,
          redirect_uri: `https://${process.env.NEXT_PUBLIC_CLIENT_ID}.discordusercontent.com`,
        }),
      });

      const { access_token } = (await response.json()) as {
        access_token: string;
      };

      res.send({ access_token });
    });
  },
});

server.listen(port).then(() => {
  console.log(`App is listening on port ${port} !`);
});
