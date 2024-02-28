import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { Server } from 'socket.io';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { IsPublic } from '../auth/decorators';

export interface Messages {
  id?: number;
  content: string;
  user_id: number;
  createdAt?: Date;
  user?: {
    name: string;
    email: string;
    id: number;
    createdAt: Date;
    updateAt: Date;
  };
}

@WebSocketGateway({ cors: '*' })
export class ChatGateway {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  @WebSocketServer()
  server: Server;

  @IsPublic()
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() args: string[]) {
    const payloadTokenJwt = await this.jwtService.verify(args[1], {
      secret: process.env.JWT_SECRET,
    });

    const user = await this.prismaService.user.findFirst({
      where: { id: payloadTokenJwt.sub },
      select: {
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        id: true,
      },
    });

    /**
     * INICIO CHAT GPT
     */
    const apiKey = process.env.IA_API_KEY; // Substitua pelo sua chave de API real

    const prompt = process.env.IA_PROMPTY;
    const model = process.env.IA_MODEL; // Ou outro modelo de sua escolha

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: args[0],
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    // .then(response => console.log(response.data.choices[0].text))
    // .catch(error => console.error(error));
    console.log(response.data.choices);
    console.log(response.data.choices[0].message.content);
    const messageAResposta =
      'Pergunta: ' +
      args[0] +
      ' <br> Resposta: ' +
      response.data.choices[0].message.content;

    /**
     * FIM CHAT GPT
     */

    const messagePrisma = await this.prismaService.message.create({
      data: { content: messageAResposta, userId: payloadTokenJwt.sub },
    });
    // const messagePrisma = await this.prismaService.message.create({
    //   data: { content: args[0], userId: payloadTokenJwt.sub },
    // });
    return this.server.emit('message', { ...messagePrisma, user });
  }
}
