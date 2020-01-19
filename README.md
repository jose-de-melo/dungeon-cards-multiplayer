# DungeonCards MMO

[Video gameplay][gameplay]

Trabalho realizado pelos alunos [Gabriel Pereira](https://github.com/GabrielBPereira), [Guilherme Domith](https://github.com/GuilhermeDomith), [José de Melo](https://github.com/jose-de-melo), [Lucas Heber](https://github.com/lucasheber), [Ricardo Costa](https://github.com/Ricardovcn) e [Tarlles Roman](https://github.com/TarllesRoman) para a disciplina de Programação para Dispositívos Móveis e Sem Fio lecionada pelo professor [Rafael Alencar](https://github.com/rafjaa) no IF Sudeste MG - Campus Barbacena em 2019.

<p align="center">
    <img src="https://raw.githubusercontent.com/jose-de-melo/dungeon-cards-multiplayer/imagens/Dungeons-Sprites/login.jpeg" alt="Login" width="300" style="margin-top:10px;margin-bottom:10px;">
</p>


Dungeon MMO é um jogo onde quatro jogadores deverão se enfrentar em 1 dungeon onde somente 1 sairá vitorioso. Sua dungeon é um tabuleiro 6x6 cheio de monstros e com 3 inimigos poderosos. Mate os monstros, colete moedas e encontre armas, quando se sentir forte o suficiente vá para cima de seus inimigos para coletar parte do seu ouro e ficar mais próximo da vitória.

<p align="center">
    <img src="https://raw.githubusercontent.com/jose-de-melo/dungeon-cards-multiplayer/imagens/Dungeons-Sprites/matriz.jpeg" alt="Matriz" width="300" style="margin-top:10px;margin-bottom:10px;">
</p>


## Como jogar

- Após realizar o login, clique no botão `Play` para ser direcionado para uma sala. Quando 4 jogadores estiverem na mesma sala o jogo irá começar automaticamente.
- O jogador irá realizar movimentos em concorrência com seus inimigos.
  - Movimentar, coletar moedas/potes e bater em monstros/heróis são considerados movimentos válidos.
- Todos os herois e monstros começam no nível 1, ao coletar moedas esse nível pode ser alterado.
  - A cada 10 moedas coletadas pelo jogador seu nível sobe.
  - A cada 100 moedas coletadas por todos os jogadores, o nível dos monstros sobe.
  - A cada 100 moedas coletadas por todos os jogadores, a poção passa a curar apenas metade do valor atual, até 1.
- Sempre que um jogador subir de nível seu dano sobe em 1 ponto e seus pontos de vida são acrescidos de 2.
- Seja o ultimo herói vivo para vencer a partida.
  - 1º -> recebe 2 pontos de liga (PDL).
  - 2º -> perde 0 pontos de liga (PDL).
  - 3º -> perde 1 pontos de liga (PDL).
  - 4º -> perde 2 pontos de liga (PDL).
  
<p align="center">
    <img src="https://raw.githubusercontent.com/jose-de-melo/dungeon-cards-multiplayer/imagens/Dungeons-Sprites/main.jpeg" alt="Main"       width="300" style="margin-top:10px;margin-bottom:10px;">
</p>
  
 ## Tecnologias utilizadas
 
Esse jogo foi desenvolvido utilizando as tecnologias [React Native](https://facebook.github.io/react-native/), [Socket.io](https://socket.io/) e [Node.js](https://nodejs.org/en/)
 
![Protótipo](imagens/node_rct_socketio.png)

[gameplay]: https://raw.githubusercontent.com/jose-de-melo/dungeon-cards-multiplayer/imagens/Dungeons-Sprites/gameplay.mp4
