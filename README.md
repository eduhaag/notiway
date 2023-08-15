<div align="center">
  <img src="/src/public/images/logo.png" alt="Logo da Notiway" width="300px" />
</div>

<div align="center">

![Badge da versão do Node](https://img.shields.io/badge/Node-v18.12.1-green?logo=nodedotjs&color=%23339933)
![Badge Versão do NPM](https://img.shields.io/badge/NPM-v9.8.1-dark_green)
![Badge de tamanho do repositório](https://img.shields.io/github/repo-size/eduhaag/notiway)
![Badge de Last Commit](https://img.shields.io/github/last-commit/eduhaag/notiway?color=orange)
![Badge de Prs](https://img.shields.io/badge/PRs-Welcome-yellow)
![Badge de Licença](https://img.shields.io/badge/licence-MIT-green)

![Badge de status do projeto](https://img.shields.io/badge/PROJETO_PAUSADO-yellow)

 <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
 <a href="#-como-executar-o-projeto">Como executar</a> • 
 <a href="#-tecnologias">Tecnologias</a> • 
 <a href="#-como-contribuir-para-o-projeto">Como contribuir</a> • 
 <a href="#-licença">Licença</a>
  
</div>

## 💻 Sobre o projeto
O Notiway é uma API Rest cujo seu objetivo principal é o envio de notificações via Whatsapp.

Aqui você encontra a API completa com todos recursos para gestão dos clientes na Notiway, além da própria estrutura de rotas para envio de Notificações para o Whasapp.

Para o envio das notificações, esta API necessida enviar requisições HTTP para um servidor rodando o WPPConnect.

Este projeto foi criado como forma de estudo de ferramentas e conceitos e não possui careter comercial.

## 🧰 Funcionalidades
- [x] CRUD de clients, consumers, users e senders;
- [x] Deve ser possível um usuário realizar a autenticação;
- [x] Recuperação de senha com token via e-mail;
- [x] Listagem de clients, consumers, users e senders;
- [x] Envio de mensagem de texto, imagem, audio, localização, contato, link, gifs e figurinhas através do Whatsapp;
- [X] Agendamento de envio das mensagens via Whatsapp;
- [x] Retentativa de envio no caso de erros;
- [x] CRUD de agendamento de mensagens;
- [x] Envio de e-mails para novos cadastros;
- [x] Comunicação via webhook com o WPPConnect e também para o front-end para atualização do QR-code de conexão com o Whatsapp;
- [x] Sistema de refresh token no controle de autenticação de usuários;
- [x] Documentar envio de mensages; (Documentação disponivel na rota / da api)
- [ ] Documentar rotas de gestão da API.

## 🚀 Como executar o projeto
### Pré-requisitos
Para executar o projeto, você vai precisar ter instalado em sua máquina as seguintes ferramentas: [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/). Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/).
Também é necessário inicializar o WPPConnect e passar via arquivo .env a URL de conexão e a *secret* do servidor. ([documentação do WppConnect](https://wppconnect.io/docs/))

### Clonando o repositório
```bash
# Clone o repositório
$ git clone git@github.com:eduhaag/notiway.git

# Acesse a página do projeto
$ cd notiway

# Instale as dependências
$ npm install

# Rode o projeto
$ npm run dev

# O servidor front-end será inicializado na porta 3333. Enviar requisições para http://localhost:5173.

```

## 🛠️ Tecnologias
- **[Node](https://nodejs.org/)**;
- **[Typescript](https://www.typescriptlang.org/)**;
- **[Vite](https://vitejs.dev/)** - Para agilizar o processo de criação e configuração do projeto;
- **[Eslint](https://eslint.org/)** - Utilitário de linting;
- **[Babel](https://babeljs.io/docs/)** - Transpilador Javascript;
- **[Axios](https://axios-http.com/)** - Realiza a comunicação com o backend por meio de requisições HTTP;
- **[Fastify](https://fastify.dev/)** - Um framework para arquitetura de servidores com Node;
- **[Primas](https://www.prisma.io/)** - Um ORM para estruturação de conexão com o banco de dados;
- **[Sentry](https://sentry.io/)** - Monitoramento de erros em produção;
- **[Agenda.js](https://github.com/agenda/agenda)** - Uma biblioteca para agendamento de tarefas e organização de filas;
- **[Bcryptjs](https://github.com/kelektiv/node.bcrypt.js)** - Utilizada na encriptação de senhas e geração de tokens;
- **[DayJs](https://day.js.org/)** - Uma biblioteca para manipulação de datas;
- **[Handlebars](https://handlebarsjs.com/)** - Linguagem de modelagem para criação de e-mails transacionais;
- **[MongoDB](https://www.mongodb.com/)** - Banco de dados NoSQL utilizado na orquestração de filas e agendamentos;
- **[NodeMailer](https://nodemailer.com/)** - Modulo para envio de e-mails;
- **[Socker.io](https://socket.io/)** - Utilizado na comunicação via web socket;
- **[Zod](https://zod.dev/)** - Biblioteca para validação esquema de dados recebidos nas requisições da API;
- **[Vitest](https://vitest.dev/)** - Biblioteca para testes automatizados. (No projeto foi utilizado em testes unitários e e2e);
- **[Supertest](https://github.com/ladjs/supertest)** - Permite enviar requisições a API nos testes e2e;
> Veja o arquivo [package.json](https://github.com/eduhaag/Memoteca/package.json)

**Utilitários**
- Editor:  **[Visual Studio Code](https://code.visualstudio.com/)**;
- Documentação: **[Redoc](https://redocly.com/)**.

## 💪 Como contribuir para o projeto
1. Faça um **fork** do projeto.
2. Crie uma nova branch com as suas alterações: `git checkout -b my-feature`
3. Salve as alterações e crie uma mensagem de commit contando o que você fez: `git commit -m "feature: My new feature"`
4. Envie as suas alterações: `git push origin my-feature`

## 📝 Licença
Este projeto está sobe a licença MIT.
