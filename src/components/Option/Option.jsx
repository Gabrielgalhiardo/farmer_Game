import './Option.css';

const Option = ({ nome, imagem, preco, level, quantidade, isSelected = false, onClick, canBuy = true, showLevelUp = false, canLevelUp = false, levelUpPrice = 0, onLevelUp }) => {
    const handleClick = () => {
        // Só executa onClick se tiver dinheiro suficiente (quando está na loja)
        if (quantidade === undefined && !canBuy) return;
        if (onClick) {
            onClick();
        }
    };
    
    return (
        <div 
            className={`option-container ${isSelected ? 'selected' : ''} ${!canBuy && quantidade === undefined ? 'disabled' : ''}`}
            onClick={handleClick}
        >
            {/* Imagem */}
            <div className="option-imagem">
                <img src={imagem} alt={nome} draggable="false" />
            </div>
            
            {/* Nome */}
            <div className="option-nome">
                <h2>{nome}</h2>
            </div>
            
            {/* Level */}
            <div className="option-level">
                <span>Nível {level}</span>
            </div>
            
            {/* Preço ou Quantidade */}
            {quantidade !== undefined ? (
                <div className="option-quantidade">
                    <span className="option-quantidade-label">Quantidade:</span>
                    <span className="option-quantidade-value">{quantidade}</span>
                </div>
            ) : (
                <div className="option-preco">
                    <span className="option-preco-label">Preço:</span>
                    <span className="option-preco-value">R$ {preco.toLocaleString('pt-BR')}</span>
                </div>
            )}
            
            {/* Botão de Level Up (apenas na loja) */}
            {showLevelUp && (
                <button 
                    className={`option-level-up-button ${canLevelUp ? '' : 'disabled'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onLevelUp) onLevelUp(e);
                    }}
                    disabled={!canLevelUp}
                    title={`Subir para nível ${level + 1}: R$ ${levelUpPrice.toLocaleString('pt-BR')}`}
                >
                    <span className="level-up-icon">⬆</span>
                    <span className="level-up-text">Nível {level + 1}</span>
                    <span className="level-up-price">R$ {levelUpPrice.toLocaleString('pt-BR')}</span>
                </button>
            )}
        </div>
    )
}

export default Option;