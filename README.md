
## :pushpin: Consumers
  ### RF
  - [ ] Deve ser possivel criar novos consumidores
  - [ ] Deve ser possivel alterar um consumidor
  - [ ] Deve ser possivel obter uma lista de consumidores
  - [ ] Deve ser possivel obter um consumidor pelo ID
  - [ ] Deve ser possivel filtrar a lista de consumidores pelo
          Tax ID, nome, email ou accetpMarketing

  ### RN
  - [ ] Os campos email e name devem ser obrigatórios
  - [ ] Os campos email e taxId devem ser unicos
  - [ ] O campo email e taxId não podem ser alterados por usuario

## :pushpin: Users
  ### RF
  - [x] Deve ser possivel criar um novo usuário
  - [x] Deve ser possivel alterar um usuário
  - [ ] Um admin deve poder alterar o nivel de acesso
  - [x] Deve ser possivel listar os usuários
  - [x] Deve ser possivel alterar a senha de um usuário
  - [ ] Um usuário deve poder fazer login

  ### RN
  - [x] o email deve ser unico
  - [ ] não deve ser possivel fazer login com senha e usuario errados
  - [x] não deve ser retornado a hashedPassword em nenhuma rota

  ### RNF
  - [ ] o password deve ser criptografado

## :pushpin: Clients
  ### RF
  - [ ] Deve ser possivel criar novos clients
  - [ ] Deve ser possivel alterar um client
  - [ ] Deve ser possivel listar os clients de um consumidor
  - [ ] Deve ser possivel deletar um client
  - [ ] Deve ser possivel alterar o status de um client

  ### RN
  - [ ] É obrigatório que o client tenha um nome e esteja associado a um Consumidor

## :pushpin: Clients Tokens
  ### RF
  - [ ] Deve ser possivel criar um novo token para um client

  ### RN
  - [ ] Cada client pode ter somente um token ativo
  - [ ] Ao gerar um novo token antes deve ser excluido o antigo

  ### RNF
  - [ ] O token deve ser um JWT
  - [ ] O token deve armazenar o clientID
  - [ ] O token não deve ter expiração

## :pushpin: Senders
  ### RF
  - [ ] Deve ser possivel criar novos senders
  - [ ] Deve ser possivel alterar sender
  - [ ] Deve ser possivel listar todos os senders
  - [ ] Deve ser possivel obter um sender pelo ID
  - [ ] Deve ser possivel filtrar a listagem por type, company, ativos, DDD e entre
        duas datas no campo lastPayment
  - [ ] Deve ser possivel desativar/ativar um sender
        Alterar rota para enabled/disabled e alterar entidades
  - [ ] Deve ser possivel atualizar a data de recarga de um sender
  - [ ] Deve ser possivel realizar o pareamento de um sender
  - [ ] Deverá ser possivel cancelar o pareamento de um sender.

  ### RN
  - [ ] Os campos name, type e fullnumber são obrigatórios
  - [ ] Os campos name e fullNumber devem ser unicos
  - [ ] Os campos name e fullNumber não pode ser alterado
  - [ ] Para a conexão do whatsapp deverá ser feito uma chamada a API do wpp
  - [ ] Para excluir o token do wpp deverá existir uma rota com chamada a API do WPP