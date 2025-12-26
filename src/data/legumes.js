import abobora from '../assets/images/legumes/abobora.png';
import brocolis from '../assets/images/legumes/brocolis.png';
import cebola from '../assets/images/legumes/cebola.png';
import cenoura from '../assets/images/legumes/cenoura.png';
import xuxu from '../assets/images/legumes/xuxu.png';

const legumes = [
    {
        id: 1,
        nome: 'Abóbora',
        imagem: abobora,
        preco: 1000, // Preço de compra
        precoVenda: 3000, // Preço de venda (lucro de 200%)
        level: 1,
        tempoCrescimento: 30 // segundos
    },
    {
        id: 2,
        nome: 'Brócolis',
        imagem: brocolis,
        preco: 600, // Preço de compra
        precoVenda: 1700, // Preço de venda (lucro de ~183%)
        level: 1,
        tempoCrescimento: 20 // segundos
    },
    {
        id: 3,
        nome: 'Cebola',
        imagem: cebola,
        preco: 400, // Preço de compra
        precoVenda: 1100, // Preço de venda (lucro de 175%)
        level: 1,
        tempoCrescimento: 15 // segundos
    },
    {
        id: 4,
        nome: 'Cenoura',
        imagem: cenoura,
        preco: 500, // Preço de compra
        precoVenda: 1400, // Preço de venda (lucro de 180%)
        level: 1,
        tempoCrescimento: 18 // segundos
    },
    {
        id: 5,
        nome: 'Chuchu',
        imagem: xuxu,
        preco: 300, // Preço de compra
        precoVenda: 800, // Preço de venda (lucro de ~167%)
        level: 1,
        tempoCrescimento: 10 // segundos
    }
];

export default legumes;

