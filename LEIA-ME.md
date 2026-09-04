# Site do Ismaelfodaa, o que trocar antes de publicar

Site estático em HTML, CSS e JS. Sobe em qualquer hospedagem, é só jogar a
pasta `site/` na raiz. Não tem build, não tem dependência.

```
site/
  index.html
  assets/css/style.css
  assets/js/main.js
  assets/img/     logo, favicon, hero desktop/mobile, foto do Ismael pra história
```

## 1. WhatsApp (bloqueia publicação)

Ainda está com número placeholder. Trocar em **um lugar só**, no topo de
`assets/js/main.js`:

```js
var WHATSAPP_NUMBER = '5500000000000'; // DDI + DDD + número, só dígitos
var WHATSAPP_MESSAGE = 'Olá! Vim pelo site e quero entrar na comunidade Ismaelfodaa.';
```

Isso atualiza o botão flutuante e o CTA da seção de oferta.

## 2. Checkout / preço (bloqueia publicação)

A seção "O que você recebe" (`id="oferta"`) ainda não tem preço nem link de
checkout. O botão "Quero entrar agora" aponta pro WhatsApp por padrão
(`#ctaOferta` em `main.js`). Se o Ismael tiver plataforma de checkout (Hotmart,
Kiwify, etc.), trocar o `href` desse botão no `index.html` pelo link direto,
e então remover o trecho que sobrescreve o `href` em `main.js`.

## 3. Depoimentos

A seção "Quem já aplicou" (`id="depoimentos"`) está com 4 cards placeholder
("Depoimento em breve"), sem nome nem resultado inventado. Assim que o Ismael
mandar print de aluno com autorização, trocar cada `.testimonial-card` no
`index.html` por uma versão com a imagem do print, nome e resultado.

## 4. FAQ

Duas respostas do FAQ estão com placeholder de conteúdo:
- "As aulas são ao vivo ou gravadas?"
- "Como funciona o pagamento?"

Editar direto no `index.html`, dentro do `#faqList`.

## 5. Rodapé

Links de "Política de Privacidade" e "Termos de Uso" apontam pra `#`. Como o
site é infoproduto (vai rodar tráfego pago), essas duas páginas precisam
existir antes de publicar anúncio, não só por estética.

## 6. Domínio

Quando o domínio for definido, atualizar `og:image` no `<head>` do
`index.html` pra URL absoluta (hoje está relativa, `assets/img/hero-desktop.png`).

## Paleta

Tudo sai das variáveis no topo de `assets/css/style.css`: `--purple: #7C3AED`
e `--magenta: #C026D3` (mesmos tons do palestrantedvalor.com, referência de
design aprovada). Trocar as duas muda o site inteiro.

## Rastreamento

Pixel do Meta e GA4 ainda não estão instalados. Quando entrar, colar o script
antes do `</head>` e disparar evento no clique dos CTAs (o JS já centraliza os
links de WhatsApp em `main.js`, então dá pra disparar o evento no mesmo lugar).

## 7. Como o hero desktop é montado (ler antes de mexer)

O hero **não é uma imagem só**. São três camadas empilhadas, e é isso que
resolve o corte de cabeça que dava com a imagem única:

| Camada | O que é | Onde está |
|--------|---------|-----------|
| 1. fundo | `hero-fundo.webp`, o cenário sem ninguém | `.hero__bg` no CSS, `background-size: cover` |
| 2. scrim | 3 degradês que escurecem a esquerda pro texto e emendam as bordas no preto | `.hero__bg::after` |
| 3. pessoa | `hero-pessoa.webp`, o Ismael recortado com fundo transparente | `<img class="hero__person">` no HTML |

A regra que segura tudo: o `top` da camada 3 é **fixo** (`calc(var(--header-h) + 4px)`),
nunca percentual. Como o cabelo começa em 11,6% da altura da imagem, o topo da
cabeça cai sempre entre 140px e 190px do topo do hero, folgado abaixo do header,
em qualquer altura de tela. A base passa do hero e é cortada pela borda da seção,
que é o efeito do mockup.

**Se trocar a imagem do Ismael:** medir onde começa o cabelo na imagem nova. Se
não for perto de 11,6%, ajustar o `top` e o `clamp()` da altura em `.hero__person`.

## 8. Imagens

Tudo em WebP, gerado com ffmpeg a partir dos PNG originais que continuam em
`Recursos Site/`. A pasta inteira de imagens do site pesa 340 KB.

```
ffmpeg -i entrada.png -vf "scale=LARGURA:-1" -c:v libwebp -quality 85 saida.webp
```

O WebP mantém o canal alpha, então o recorte do Ismael continua transparente.

## 9. Tipografia

- Display (h1, h2, números): **Archivo Black**. Só existe no peso 400, então o
  CSS usa `font-weight: 400` nesses elementos. Se colocar 700 ou 800, o browser
  engorda a fonte por conta própria e ela fica borrada
- Corpo, h3, h4, botões: **Manrope**
