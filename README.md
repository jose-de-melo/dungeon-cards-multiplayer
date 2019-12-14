# Dungeon Cards MMO

Trabalho realizado pelos alunos [Gabriel Pereira](https://github.com), [Guilherme Domith](https://github.com), [José de Melo](https://github.com), [Lucas Reveli](https://github.com), [Ricardo Costa](https://github.com) e [Tarlles Roman](https://github.com); para a disciplina de Programação para Dispositívos Móveis e Sem Fio lecionada pelo professor [Rafael Alencar](https://github.com) no IF Sudeste MG - Barbacena em 2019.


#####Imagem da tela de login#####



Dungeon MMO é um jogo onde quatro jogadores, deverão se enfrentar em 1 dungeon onde somente 1 sairá vitorioso. Sua dungeon é um tabuleiro 6x6 cheio de monstros e com 3 inimigos poderosos. Mate os monstros, colete moedas e encontre armas, quando se sentir forte o suficiente vá para cima de seus inimigos para coletar parte do seu ouro e ficar mais próximo da vitória.




####Imagem da tela com a matriz####



### Como jogar

- Após realizar o login clique no botão `Play` para ser direcionado para uma sala. Quando 4 jogadores estiverem na mesma sala o jogo irá começar automaticamente.
- O jogo funciona por turnos.
  - A cada turno um jogador possui de 0 a 6 movimentos, sendo essa quantidade escolhida aleatoriamente.
  - Movimentar, coletar moedas/potes e bater em monstros/heróis são considerados movimentos.
  - Ao final de um turno a vez será passada a outro jogador sendo observado o sentido horário de acordo com a posição inicial de cada heroi.
- Todos os herois e monstros começam no nível 1, ao coletar moedas esse nível pode ser alterado.
  - A cada 10 moedas coletadas pelo jogador seu nível sobe.
  - A cada 100 moedas coletadas por todos os jogadores, o nível dos monstros sobe.
  - A cada 100 moedas coletadas por todos os jogadores, a poção passa a curar apenas metade do valor atual, até 1.
- Sempre que um jogador subir de nível seu dano sobe em 1 ponto e sua vida é acrescentada de 2.
- Seja o ultimo herói vivo para vencer a partida.
  - 1º -> recebe 3 pontos de liga (PDL).
  - 2º -> recebe 2 pontos de liga (PDL).
  - 3º -> recebe 0 pontos de liga (PDL).
  - 4º -> perde 2 pontos de liga (PDL).
  
 ### Tecnologias utilizadas
 
 Esses jogo foi desenvolvido utilizando as tecnologias [Socket.io]() [React Native]() [Backend eu não sei]()
 
