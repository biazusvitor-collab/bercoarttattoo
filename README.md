# Berço Art Tattoo & Piercing

Site do estúdio Berço Art, Rua da Cruz da Argola, 954, Guimarães, Portugal.

Site estático (HTML, CSS e JavaScript), publicado com GitHub Pages.

## Estrutura

- `index.html` — página única com hero em vídeo, trabalhos, estúdio, como marcar, galeria e contactos
- `css/style.css` — estilos (preto e dourado)
- `js/main.js` — animações ao fazer scroll, menu e marcação pelo WhatsApp
- `assets/` — vídeo (sem som), logótipo e fotografias
- `fonts/` — Grenze Gotisch e Archivo (SIL Open Font License), alojadas no próprio site

## Alterar o número ou as mensagens do WhatsApp

No início de `js/main.js`:

```js
var WHATSAPP = '351923374359';
var MENSAGENS = {
  tatuagem: { texto: 'Olá! Queria fazer um orçamento de uma tatuagem.' },
  piercing: { texto: 'Olá! Queria fazer um orçamento de um piercing.' }
};
```

## Domínio .pt

Para usar um domínio próprio (por exemplo `bercoarttattoo.pt`), registe-o num registrar acreditado pela .PT,
crie um ficheiro `CNAME` na raiz do repositório com o domínio e configure o DNS conforme a documentação do
GitHub Pages.
