Equilíbrio e Terapia – Front-end da Aplicação de Conselhos com Tarot
Este é o front-end da aplicação desenvolvida como parte da disciplina Desenvolvimento Full Stack Básico da PUC-Rio. Ele oferece uma interface interativa e amigável para que os usuários possam obter conselhos personalizados baseados nos Arcanos Maiores do Tarot, com base em seu ano de interesse e data de nascimento.
________________________________________
Tecnologias Utilizadas
   •	HTML5
   •	CSS3
   •	JavaScript Vanilla
   •	FontAwesome CDN (ícones)
________________________________________
Estrutura de Pastas
      meu_app_front/
      ├── index.html         # Página principal da aplicação
      ├── script.js          # Lógica de interação e integração com a API
      ├── style.css          # Estilo visual personalizado
      └── imagens/           # Imagens dos Arcanos Maiores e fundo
         ├── 1.jpg
         ├── 2.jpg
         ├── ...
         └── fundo3.jpg
________________________________________
Funcionalidades
   •	Geração de conselho anual com base no nome, ano e aniversário do consulente
   •	Modal de cadastro com validação de e-mail e nome completo
   •	 Exibição do histórico de conselhos com possibilidade de exclusão
   •	 Validações front-end para dados obrigatórios e formatos (ano com 4 dígitos, data de nascimento no passado, etc.)
   •	 Exibição automática da imagem do arcano relacionado ao conselho gerado pelo ano e data de nascimento.
   •	 Integração com a API Flask para consulta, cadastro e histórico
   •	 Botão Limpar que reseta os campos e retorna à tela inicial.
________________________________________
 Como Executar
   1.	Certifique-se de que o back-end Flask (meu_app_api) esteja rodando na porta padrão http://localhost:5000.
   2.	Com isso feito, abra o index.html no navegador:
   o	Clique duas vezes no arquivo
   ou
   o	Execute pelo terminal:
________________________________________
Conexão com a API
A aplicação faz chamadas para os seguintes endpoints da API local:
Endpoint	Método	Função
   /conselho	POST	Geração do conselho
   /consulentes	POST	Cadastro de novos consulentes
   /historico	GET	Lista o histórico de conselhos
   /historico/{id}	DELETE	Exclui conselho do histórico
________________________________________
Observações
   •	O campo "Ano" só aceita exatamente 4 dígitos numéricos.
   •	O campo "Data de nascimento" deve estar no formato DD/MM/AAAA e não pode estar no futuro.
   •	O rodapé foi adaptado para ser exibido sem necessidade de rolagem.
   •	As mensagens e erros estão padronizados para feedback claro ao usuário.

