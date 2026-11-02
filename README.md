# Nosso Universo

Site responsivo em HTML, CSS e JavaScript puro, sem backend e sem bibliotecas.
A página mostra apenas o conteúdo de vocês. Toda instrução fica aqui neste README.

## Estrutura

| Capítulo | Conteúdo |
|---|---|
| 1 | Apresentação, nossa história e como começou, botões de interesse (atalhos para cada parte) |
| 2 | Contagem de anos, meses, dias, horas, minutos e segundos desde 14/10/2026 às 21h, e a foto das alianças |
| 3 | Nossas músicas favoritas e nossas cores favoritas (azul dela, vermelho seu, roxo dos dois, com degradê) |
| 4 | Alguns números |
| 5 | Nosso álbum e nossos melhores momentos em carrossel |
| Final | Cartinha com botão de abrir |

## Como abrir
1. Extraia a pasta `nosso-universo`.
2. Abra `index.html` no navegador (ou use a extensão Live Server do VS Code).

## Onde personalizar
Quase tudo fica em **`js/config.js`**:

| Campo | O que controla |
|---|---|
| `startDate` | Data e hora do início (14/10/2026 às 21h). `month` vai de 1 a 12. Alimenta a contagem, a data da história e o selo da apresentação. |
| `intro` | Frase de apresentação do capítulo 1: `kicker`, `title`, `highlight` (trecho colorido) e `text`. |
| `story` | Parágrafos de "Nossa história e como começou". O texto atual é genérico: substitua pelo relato real de vocês. |
| `ringsPhoto` | Caminho da foto das alianças. |
| `songs` | `title`, `artist` (pode ficar `""`) e `file` de cada uma das duas músicas. |
| `album` | Fotos fixas do álbum (veja abaixo). |
| `memories` | Título, etiqueta, descrição e foto de cada um dos melhores momentos do carrossel. |
| `carouselSeconds` | Segundos entre trocas automáticas do carrossel. Use `0` para desligar. |
| `letter` | Saudação, texto e assinatura da cartinha. |

Os textos do capítulo 4 (números) estão direto no `index.html`, na seção `id="numeros"`.

## Fotos
Coloque as imagens em `assets/images/`:

- `aliancas.jpg`: foto das alianças (capítulo 2). Sem ela, aparece uma ilustração de duas alianças.
- `photo-01.jpg`, `photo-02.jpg`, `photo-03.jpg`: fotos dos melhores momentos (carrossel). Sem elas, os slides usam fundos em degradê.

Também dá para trocar a foto das alianças pela própria página, no botão da câmera no canto da foto.

## Álbum e upload de fotos
- **Adicionar fotos** aceita várias imagens de uma vez. Elas são reduzidas e **salvas no navegador de quem enviou** (IndexedDB). Ficam lá nas próximas visitas, mas **não aparecem em outro aparelho ou navegador**, pois não há servidor.
- Passe o mouse (ou toque) em uma foto enviada: ★ destaca a foto e ela entra no carrossel; × remove.
- Clique em uma foto para ampliar.
- Para o álbum aparecer igual para todo mundo, coloque as fotos em `assets/images/album/` e liste em `js/config.js`:

```js
album: ["assets/images/album/01.jpg", "assets/images/album/02.jpg"],
```

## Músicas
Use arquivos de áudio que você tem autorização para usar:

- `assets/music/song-01.mp3`
- `assets/music/song-02.mp3`

Nomes e caminhos podem ser mudados em `songs`. Enquanto o arquivo não existir, o botão de play fica desativado.

## Cores
Azul (dela), vermelho (seu) e roxo (dos dois) estão no início de `css/style.css`, nas variáveis `--blue`, `--red` e `--purple`. O degradê do capítulo 3 (classe `.gradient-bar`, no mesmo arquivo) vai do azul ao vermelho e se encontra no roxo, no centro.

## Publicar
Dá para hospedar de graça no GitHub Pages ou no Netlify. Não é preciso instalar nada.
