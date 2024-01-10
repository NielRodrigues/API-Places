# Desafio do desenvolvedor backend

## Descrição do projeto

Esta é uma API desenvolvida em NodeJS com ExpressJS. Essa aplicação simples para criar e autenticar um usuário e criação de .



## Desenvolvimento

Para o desenvolvimento desse projeto foi utilizado algumas bibliotecas e frameworks para um melhor desenvolvimento, listei algumas delas abaixo

- **express**: ExpressJS é uma framework para realizar protocólos HTTP.
- **sequelize**: Nesse projeto foi utilizado o ORM Sequelize para a integração com o Banco de Dados (PotgreSQL).
- **bcrypt**: O bcrypt é uma biblioteca do javascript para fazer a criptografia de dados. Nesse projeto ela foi utilizada para criptografar a senha do usuário.
- **jsonwebtoken**: O jsonwebtoken é uma biblioteca para criar tokens de acesso que tem uma prazo para expiração. Caso o usuário quiser acessar a API, ele deve realizar o login, onde será retornado um token de acesso para 7 dias, após esse período ele deve fazer o login novamente.

Para esse projeto, também foi utilizada uma arquitetura de código limpa, com pastas e estruturas organizadas para melhor desenvolvimento. 



## Instruções para instalação

Para usar a aplicação, primeiramente deve criar um novo banco de dados no PGAdmin do PostgreSQL com o nome _places_

```
CREATE DATABSE places
```


Depois você precisa realizar as migrations para o banco de dados com o sequelize, para isso vá na raiz do projeto e use o comando:

```
yarn sequelize db:migrate
```
ou
```
npx sequelize db:migrate
```


Agora para rodar a aplicação utilize 
```
yarn dev
```
ou
```
npm run dev
```


## Como usar

As rotas _/login_ e _/register_ não precisa de autorização passada do Header

<img src="/assets/images/1.png">

1. Para se criar um usuário, deve-se usar o método _POST_ em algumas das rotas de registro e passar os seguintes parâmetros no body via JSON.
  - _name_: _string_
  - _email_: _string_
  - _password_: _string_

<img src="/assets/images/2.png">


2. Para realizar o login, acesse a rota de _/login_ e passa o seguintes parâmetros no body via JSON.
  - _email_: _string_
  - _password_: _string_

Ele irá retornar um token de acesso válido por 7 dias, com esse token você pode passar ao header _authorization_ para poder acessar as outras rotas

<img src="/assets/images/3.png">

<img src="/assets/images/4.png">

<img src="/assets/images/5.png">


3. Para criar um novo lugar, você deve acessar a rota _/places_ via _POST_ e passar os seguintes parâmetros:
  - _name_: _string_
  - _city_: _string_
  - _state_: _string_

<img src="/assets/images/6.png">


4. Para verificar lugares específicos, deve acessar a rota de lugares (PLACES) e fornecer o ID do local. _/places/:id_.

<img src="/assets/images/7.png">

5. Você também pode filtrar os lugares por nome, cidade ou estado. Basta passar a QUERY na url: _?name=_, _?city=_ ou _?state=_

<img src="/assets/images/10.png">

<img src="/assets/images/11.png">


#### Nota-se: os tokens de acesso para os usuários são diferentes, além que de as rotas específicas onde precisa-se passar o parâmentro ID, como as rotas de _GET_, _PUT_ e _DELETE_, um usuário não consegue acessar se o ID for diferente.

#### Exemplo: o usurário com ID 2 não pode accessar a rota _/users/1_ por que o token de acesso dele guarda o ID dele, e verifica se a rota na qual ele que acessar é de seu ID ou não.

<img src="/assets/images/8.png">

<img src="/assets/images/9.png">
