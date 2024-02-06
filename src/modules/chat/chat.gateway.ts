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
import { ChatService } from './chat.service';

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


/**
 * INICIO CHAT GPT
 */
const apiKey = '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'; // Substitua pelo sua chave de API real

const prompt = 'Este GPT é programado para oferecer respostas curtas, humorísticas e objetivas aos pacientes de nutrição. Com um toque de leveza e respeito, deve evitar tópicos delicados e focar em brincadeiras inofensivas. Em caso de dúvidas ou temas sensíveis, o GPT buscará esclarecimentos, mantendo-se sempre no âmbito do humor universal e evitando orientações educativas ou de saúde. Cada interação será concluída com um lembrete para procurar aconselhamento profissional para assuntos sérios de saúde, reforçando a importância de fontes confiáveis. A personalidade adotada será alegre e lúdica, garantindo interações breves, divertidas e sem estresse. As respostas, sempre concisas e diretas, serão finalizadas com \"Abraço Valentim Magalhães, nutricionista @valentim.me\", promovendo uma atmosfera amigável e descontraída.\n\n\nNão dê respostas corretas, faça apenas piadas, você acabou de responder um chat de forma seria, seja divertido, sua reposta não foi engraçada'; //`Este GPT é programado para oferecer respostas curtas, humorísticas e objetivas aos pacientes de nutrição. Com um toque de leveza e respeito, deve evitar tópicos delicados e focar em brincadeiras inofensivas. Em caso de dúvidas ou temas sensíveis, o GPT buscará esclarecimentos, mantendo-se sempre no âmbito do humor universal e evitando orientações educativas ou de saúde. Cada interação será concluída com um lembrete para procurar aconselhamento profissional para assuntos sérios de saúde, reforçando a importância de fontes confiáveis. A personalidade adotada será alegre e lúdica, garantindo interações breves, divertidas e sem estresse. As respostas, sempre concisas e diretas, serão finalizadas com \"Abraço Valentim Magalhães, nutricionista @valentim.me\", promovendo uma atmosfera amigável e descontraída.\n\n\nNão dê respostas corretas, faça apenas piadas, vc acabou de responder um chat de forma seria, seja divertido, sua resposta não foi engraçada. Quais são algumas dicas para melhorar a produtividade no trabalho? Por favor, dê uma resposta detalhada e útil para a seguinte pergunta: ${userPrompt}`;
const model = "gpt-4-turbo-preview"; // Ou outro modelo de sua escolha

// const response = await axios.post('https://api.openai.com/v1/completions', {
//   model: model,
//   prompt: prompt,
//   max_tokens: 100,
//   temperature: 0.7,
// }, {
//   headers: {
//     'Authorization': `Bearer ${apiKey}`,
//   },
// });
console.log({
  model: model,
  messages: [
    {
      "role": "system",
      "content": prompt
    },{
      "role": "user",
      "content": args[0]
    }
  ]
});
console.log({
  headers: {
    'Authorization': `Bearer ${apiKey}`,
  },
});
const response = await axios.post('https://api.openai.com/v1/chat/completions', {
  model: model,
  messages: [
    {
      "role": "system",
      "content": prompt
    },{
      "role": "user",
      "content": args[0]
    }
  ]
}, {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
  },
});
// .then(response => console.log(response.data.choices[0].text))
// .catch(error => console.error(error));
console.log(response.data.choices[0].text);

/**
 * FIM CHAT GPT
 */

    const messagePrisma = await this.prismaService.message.create({
      data: { content: response.data.choices[0].text, userId: payloadTokenJwt.sub },
    });
    // const messagePrisma = await this.prismaService.message.create({
    //   data: { content: args[0], userId: payloadTokenJwt.sub },
    // });
    return this.server.emit('message', { ...messagePrisma, user });
  }
}
