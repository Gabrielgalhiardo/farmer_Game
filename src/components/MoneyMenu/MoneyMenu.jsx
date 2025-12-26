import './MoneyMenu.css';

const MoneyMenu = ({ money = 0 }) => {
    const formatMoney = (value) => {
        // Formata números grandes de forma mais compacta se necessário
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        }
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    return (
        <div className="money-menu-container" title={`Saldo: R$ ${money.toLocaleString('pt-BR')}`}>
            <h1>R$ {formatMoney(money)}</h1>
        </div>
    )
}

export default MoneyMenu;