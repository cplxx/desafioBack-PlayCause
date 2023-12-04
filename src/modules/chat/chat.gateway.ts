import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';

import { ChatService } from './chat.service';
import { Server } from 'socket.io';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

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

@WebSocketGateway(8001, { cors: '*' })
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  @WebSocketServer()
  server: Server;

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

    const messagePrisma = await this.prismaService.message.create({
      data: { content: args[0], userId: payloadTokenJwt.sub },
    });
    return this.server.emit('message', { ...messagePrisma, user });
  }
}
