# CestaOS

Protótipo funcional de uma plataforma multi-mercado com três experiências conectadas:

- `/` — vitrine do cliente, busca, filtros, carrinho e checkout;
- `/admin` — operação do mercado, Kanban de pedidos, catálogo, financeiro e identidade da loja;
- `/superadmin` — gestão master de mercados, comissões sobre pedidos, repasses e dados Pix.

## Executar

```bash
npm install
npm run dev
```

## Persistência

Esta versão é uma demonstração front-end. Os dados ficam no `localStorage` do navegador e sincronizam entre abas. O checkout cria pedidos reais no Kanban e os indicadores financeiros são recalculados a partir dos pedidos entregues.

Para produção, substitua a camada de contexto por uma API com banco de dados, autenticação, gateway de pagamento, armazenamento de imagens e emissão financeira.
